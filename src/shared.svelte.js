import { sample } from 'lodash-es';
import { APP_STATE, CELL_COUNT, LEVELS, MAX_STRIKES, MODE_PRACITCE, PROMPT_PLAY_AGAIN, SIZE, TASKS_PER_LEVEL, TICK_MS } from './const';
import { solve } from './solver';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { post } from './utils';

export const _log = (value) => console.log($state.snapshot(value));

export const appKey = () => `${APP_STATE} • ${ss.mode}`;

export const persist = () => {
    let json = JSON.stringify({ sfx: _sound.sfx, music: _sound.music });
    localStorage.setItem(APP_STATE, json);

    if (!ss.practice) {
        json = JSON.stringify({ ..._stats, level: ss.level, cells: ss.cells, initial: ss.initial, ticks: ss.ticks, tasks: ss.tasks, points: ss.points, strikes: ss.strikes, over: ss.over, levelComplete: ss.levelComplete });
        localStorage.setItem(appKey(), json);
    }
};

const loadCommon = () => {
    const json = localStorage.getItem(APP_STATE);
    const job = JSON.parse(json);

    if (job) {
        _sound.sfx = job.sfx;
        _sound.music = job.music;
    }
};

const loadGame = () => {
    loadCommon();

    const json = localStorage.getItem(appKey());
    const job = JSON.parse(json);

    if (job) {
        _stats.plays = job.plays;
        _stats.total = job.total;
        _stats.best = job.best;

        const over = job.over;
        const levelComplete = job.levelComplete;

        ss.level = over ? 1 : job.level;
        ss.ticks = over || levelComplete ? 0 : -job.ticks;
        ss.tasks = over ? 0 : job.tasks;
        ss.points = over ? 0 : job.points;
        ss.strikes = over || levelComplete ? 0 : job.strikes;
        ss.cells = over || levelComplete ? null : job.cells;
        ss.initial = over || levelComplete ? null : job.initial;
    } else {
        _stats.plays = 0;
        _stats.total = 0;
        _stats.best = 0;
        ss.level = 1;
        ss.ticks = 0;
        ss.tasks = 0;
        ss.points = 0;
        ss.strikes = 0;

        delete ss.cells;
        delete ss.iniital;
    }
};

export const showIntro = (value, plop = true) => {
    plop && _sound.play('plop');
    ss.home = true;
    stopTimer();
};

export const isSolved = () => {
    const space = spaceCell();

    if (!space) {
        return false;
    }

    const center = (SIZE + 1) / 2;
    return space.row === center && space.col === center;
};

export const indexOf = (row, col) => (row - 1) * SIZE + col - 1;

const makeCells = () => {
    const cells = Array(CELL_COUNT);
    const [srow, scol] = sample([[1, 1], [1, SIZE], [SIZE, SIZE], [SIZE, 1]]);

    for (let i = 0; i < CELL_COUNT; i++) {
        const row = Math.floor(i / SIZE) + 1;
        const col = i % SIZE + 1;
        const cell = { id: i + 1, row, col };

        cell.weight = Math.random() < 0.5 ? 1 : -1;

        if (cell.col === scol) {
            if (cell.row < srow) {
                cell.weight = -1;
            } else if (row === srow) {
                cell.weight = 0;
            } else if (row === srow + 1) {
                cell.weight = 1;
            }
        }

        cells[i] = cell;
    }

    return cells;
};

const doMakePuzzle = () => {
    let cells = makeCells();
    let steps;

    const acceptable = () => {
        if (steps === null) {
            // no solution
            return false;
        }

        if (ss.practice) {
            // any number of steps is ok
            return true;
        }

        const level = Math.min(ss.level, LEVELS.length);
        const moves = steps.length;

        switch (level) {
            case 1:
                return moves >= 2 && moves <= 3;
            case 2:
                return moves >= 2 && moves <= 4;
            case 3:
                return moves >= 2 && moves <= 5;
            case 4:
                return moves >= 3;
            default:
                return true;
        }
    };

    do {
        cells = makeCells();
        steps = solve(cells);
    } while (!acceptable());

    // _log(steps);
    ss.steps = steps;

    ss.initial = [...cells];
    ss.cells = cells;
};

export const startTimer = () => {
    ss.timer = setInterval(onTick, TICK_MS);
};

export const stopTimer = () => {
    clearInterval(ss.timer);
    delete ss.timer;
};

const onTick = () => {
    if (isAnimated()) {
        return;
    }

    ss.ticks++;

    if (!ss.practice) {
        if (secsRemained() <= 0) {
            stopTimer();
            onFail();
        }

        persist();
    }
};

const onFail = () => {
    _sound.play('lost');

    ss.fail = true;
    ss.strikes++;

    onTaskCompleted();

    persist();

    if (ss.strikes === MAX_STRIKES) {
        _prompt.set(PROMPT_PLAY_AGAIN);
    } else {
        post(() => (ss.swirl = true), 1000);
    }
};

export const onTaskCompleted = () => {
    ss.tasks++;

    if (ss.strikes === MAX_STRIKES) {
        ss.over = true;

        _stats.plays++;
        _stats.total += ss.points;

        if (ss.points > _stats.best) {
            _stats.best = ss.points;
        }

        return;
    }

    if (levelComplete()) {
        ss.levelComplete = true;
        ss.level++;
    }
};

const levelComplete = () => ss.tasks % TASKS_PER_LEVEL === 0;

export const calcPoints = () => LEVELS[0].secs - elapsedSecs();

export const elapsedSecs = () => Math.round(((ss.ticks || 0) * TICK_MS) / 1000);

export const secsRemained = () => {
    const level = Math.min(ss.level - (ss.levelComplete ? 1 : 0), LEVELS.length);
    const maxSecs = LEVELS[level - 1].secs;

    if (ss.levelPrompt) {
        return maxSecs;
    }

    const elapsed = elapsedSecs();
    return Math.max(0, maxSecs - elapsed);
};

export const makePuzzle = () => {
    delete ss.fail;

    doMakePuzzle();

    if (!ss.practice && ss.tasks % TASKS_PER_LEVEL === 0) {
        _sound.play('won');
        ss.levelPrompt = true;
        ss.strikes = 0;
    } else {
        onStart();
    }
};

export const onStart = (chime = 'dice') => {
    stopTimer();
    _sound.play(chime);

    if (!_sound.musicPlayed) {
        post(() => _sound.playMusic(), 1000);
    }

    if (!ss.practice) {
        delete ss.over;
        delete ss.levelComplete;

        persist();
    }

    ss.ticks = !ss.practice && ss.ticks < 0 ? -ss.ticks : 0;
    ss.delay = true;

    post(() => {
        startTimer();
        post(() => delete ss.delay, 500);
    }, 500);
};

export const onMode = (mode) => {
    _prompt.opacity = 0;

    ss.mode = mode;
    ss.practice = mode === MODE_PRACITCE;

    _sound.play('plop');

    if (ss.practice) {
        loadCommon();
        delete ss.over;
        makePuzzle();
    } else {
        loadGame();

        if (!ss.cells) {
            doMakePuzzle();
        }

        ss.levelPrompt = true;
    }

    delete ss.home;
};

export const spaceCell = (cells = ss.cells) => cells?.find((cob) => cob.weight === 0);

export const isInitial = () => ss.cells?.every((c, i) => c.id === ss.initial[i].id);

export const onSetToInitial = () => {
    if (isInitial()) {
        return;
    }

    for (let i = 0; i < CELL_COUNT; i++) {
        const cell = ss.cells[i];
        const cob = ss.initial.find((c) => c.id === cell.id);
        cell.newRow = cob.row;
        cell.newCol = cob.col;
    }

    post(() => {
        _sound.play('score2');

        post(() => {
            // don't inline
            ss.cells = [...ss.initial];
        }, 250);
    }, 100);
};

export const isAnimated = () => ss.delay || ss.flip || ss.spin || ss.cells?.some((c) => c.newRow || c.newCol);