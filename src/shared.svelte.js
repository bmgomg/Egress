import { sample } from 'lodash-es';
import { APP_STATE, CELL_COUNT, LEVELS, SIZE } from './const';
// import { solve } from './solver';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { post } from './utils';
import { generatePuzzle } from './solver';

export const _log = (value) => console.log($state.snapshot(value));

export const appKey = () => `${APP_STATE} • ${ss.mode}`;

export const persist = () => {
    let json = JSON.stringify({ sfx: _sound.sfx, music: _sound.music });
    localStorage.setItem(APP_STATE, json);

    json = JSON.stringify({ ..._stats, level: ss.level, cells: ss.cells, initial: ss.initial, ticks: ss.ticks, tasks: ss.tasks, points: ss.points, strikes: ss.strikes, over: ss.over, levelComplete: ss.levelComplete });
    localStorage.setItem(appKey(), json);
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

        ss.cells = job.cells;
        ss.initial = job.initial;
    } else {
        _stats.plays = 0;
        _stats.total = 0;
        _stats.best = 0;

        delete ss.cells;
        delete ss.iniital;
    }
};

export const showIntro = (value, plop = true) => {
    plop && _sound.play('plop');
    ss.home = true;
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

const makeCells = (grid) => {
    const cells = Array(CELL_COUNT);

    for (let row = 1, i = 0; row <= SIZE; row++) {
        for (let col = 1; col <= SIZE; col++, i++) {
            const ob = grid[row - 1][col - 1];
            const cell = { id: i + 1, row, col, weight: ob === 'B' ? 1 : -1 };
            cells[i] = cell;
        }
    }

    return cells;
};

const doMakePuzzle = () => {
    // const { grid, door, solution } = generatePuzzle(SIZE);
    const grid = [['B', 'B', 'B',], ['O', 'O', 'O',], ['O', 'O', 'B',]];
    const door = { side: 'top', index: 0 };
    const solution = ['CW', 'CCW', 'CCW', 'CW'];

    console.log(grid);
    console.log(door);
    console.log(solution);

    let cells = makeCells(grid);
    ss.door = door.side[0] + door.index;
    ss.solution = solution;

    ss.initial = [...cells];
    ss.cells = cells;
};

export const makePuzzle = () => {
    doMakePuzzle();
    onStart();
};

const onStart = () => {
    _sound.play('dice');

    if (!_sound.musicPlayed) {
        post(() => _sound.playMusic(), 1000);
    }

    delete ss.over;

    persist();
};

export const onHomePlay = () => {
    _prompt.opacity = 0;

    _sound.play('plop');

    loadGame();

    if (!ss.cells) {
        makePuzzle();
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

export const isAnimated = () => ss.delay || ss.spin || ss.cells?.some((c) => c.newRow || c.newCol);