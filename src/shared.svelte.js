import { APP_STATE } from './const';
import { BLOCK, EMPTY, generatePuzzle } from './generator';
import { _sound } from './sound.svelte';
import { _stats, ss } from './state.svelte';
import { post } from './utils';

export const _log = (value) => console.log($state.snapshot(value));

export const appKey = () => `${APP_STATE} • ${ss.size}`;

export const persist = () => {
    let json = JSON.stringify({ sfx: _sound.sfx, music: _sound.music });
    localStorage.setItem(APP_STATE, json);

    json = JSON.stringify({ ..._stats, cells: ss.cells, door: ss.door, initial: ss.initial, solution: ss.solution, moves: ss.moves });
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
        ss.door = job.door;
        ss.solution = job.solution;
        ss.moves = job.moves;
    } else {
        _stats.plays = 0;
        _stats.total = 0;
        _stats.best = 0;

        delete ss.cells;
    }
};

export const showIntro = (value, plop = true) => {
    plop && _sound.play('plop');
    ss.home = true;
};

export const isSolved = () => ss.cells?.every(c => c.weight === 0);

export const indexOf = (row, col) => (row - 1) * ss.size + col - 1;

const makeCells = (grid) => {
    const cells = Array(ss.size * ss.size);

    for (let row = 1, i = 0; row <= ss.size; row++) {
        for (let col = 1; col <= ss.size; col++, i++) {
            const ob = grid[row - 1][col - 1];
            const cell = { id: i + 1, row, col, weight: ob === BLOCK ? 1 : ob === EMPTY ? 0 : -1 };
            cells[i] = cell;
        }
    }

    return cells;
};

export const makePuzzle = () => {
    delete ss.fail;

    const { grid, door, solution } = generatePuzzle(ss.size, 2, 15);

    let cells = makeCells(grid);
    ss.door = door;
    ss.solution = solution;

    ss.initial = { cells: [...cells], door: { ...ss.door } };
    ss.cells = cells;
    ss.moves = 0;

    persist();

    _sound.play('dice');
    onStart();
};

const onStart = () => {

    if (!_sound.musicPlayed) {
        post(() => _sound.playMusic(), 1000);
    }
};

export const onHomePlay = (size) => {
    _sound.play('plop');

    ss.size = size;
    loadGame();

    if (ss.cells) {
        onStart();
    } else {
        makePuzzle();
    }

    delete ss.home;
};

export const isInitial = () => {
    if (JSON.stringify(ss.door) !== JSON.stringify(ss.initial?.door)) {
        return false;
    }

    if (JSON.stringify(ss.cells) !== JSON.stringify(ss.initial?.cells)) {
        return false;
    }

    return true;
};

export const setToInitial = () => {
    if (isInitial()) {
        return;
    }

    ss.cells = [...ss.initial.cells];
    ss.door = { ...ss.initial.door };
};

export const isAnimated = () => ss.noui || ss.surrender;

export const findCell = (cells, row, col) => cells.find((c) => c.row === row && c.col === col);

export const playSolution = () => {
    for (let i = 0; i < ss.solution.length; i++) {
        const spin = ss.solution[i] === 'CW' ? 1 : -1;

        post(() => {
            _sound.play('click');
            ss.spin = spin;

            if (i === ss.solution.length - 1) {
                post(() => delete ss.surrender, 1000);
            }
        }, i * 1500);
    }
};