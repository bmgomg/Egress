import { sample } from 'lodash-es';
import { APP_STATE, INTRO_PUZZLES, NO_SLIDE, OP_EASY, OP_NOT_EASY, SLIDE_DOWN, SLIDE_UP } from './const';
import { BLOCK, BUBBLE, canSolve, EMPTY, generatePuzzle } from './core';
import { _sound } from './sound.svelte';
import { _stats, ss } from './state.svelte';
import { post } from './utils';

export const _log = (value) => console.log($state.snapshot(value));

export const appSubKey = () => `${ss.challenge}`;
export const appKey = () => `${APP_STATE} • ${appSubKey()}`;

export const persist = (commonOnly = false) => {
    let json = JSON.stringify({ sfx: _sound.sfx, music: _sound.music, seenRed: ss.seenRed, seenBlue: ss.seenBlue });
    localStorage.setItem(APP_STATE, json);

    if (commonOnly) {
        return;
    }

    json = JSON.stringify({ ..._stats, cells: ss.cells, door: ss.door, initial: ss.initial, solution: ss.solution, slide: ss.slide, moves: ss.moves, over: ss.over });
    localStorage.setItem(appKey(), json);
};

export const slideOp = () => ss.challenge === OP_EASY ? NO_SLIDE : ss.slide;

const loadCommon = () => {
    const json = localStorage.getItem(APP_STATE);
    const job = JSON.parse(json);

    if (job) {
        _sound.sfx = job.sfx;
        _sound.music = job.music;
        ss.seenRed = job.seenRed;
        ss.seenBlue = job.seenBlue;
    }
};

const loadGame = () => {
    loadCommon();

    const json = localStorage.getItem(appKey());
    const job = JSON.parse(json);

    delete ss.cells;

    if (job) {
        _stats.plays = job.plays;
        _stats.wins = job.wins;
        _stats.total = job.total;

        if (ss.seenPage[appSubKey()] || !job.over) {
            ss.cells = job.cells;
            ss.initial = job.initial;
            ss.door = job.door;
            ss.solution = job.solution;
            ss.moves = job.moves;
            ss.slide = job.slide;
        }
    } else {
        _stats.plays = 0;
        _stats.wins = 0;
        _stats.total = 0;
    }
};

export const isSolved = () => ss.cells?.every(c => c.weight === 0);

export const indexOf = (row, col) => (row - 1) * ss.size + col - 1;

export const isSolvable = () => {
    const grid = Array.from({ length: ss.size }, () => Array(ss.size).fill(EMPTY));

    for (const cell of ss.cells) {
        if (cell.weight > 0) {
            grid[cell.row - 1][cell.col - 1] = BLOCK;
        } else if (cell.weight < 0) {
            grid[cell.row - 1][cell.col - 1] = BUBBLE;
        }
    }

    const can = canSolve(grid, ss.door, slideOp());
    return can;
};

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

const nextIntroPuzzle = (i) => {
    const { grid, door, slide, solution } = INTRO_PUZZLES[i];
    ss.slide = slide;

    return { grid, door, solution };
};

export const makePuzzle = () => {
    delete ss.over;
    delete ss.deadend;

    const steps = ss.challenge === OP_EASY ? [3, 7] : ss.challenge === OP_NOT_EASY ? [5, 9] : [9, 15];

    let pzl;

    if (ss.challenge === OP_NOT_EASY && _stats.plays < INTRO_PUZZLES.length) {
        pzl = nextIntroPuzzle(_stats.plays);
    } else {
        if (ss.challenge > OP_EASY) {
            ss.slide = sample([SLIDE_UP, SLIDE_DOWN]);
        }

        pzl = generatePuzzle(ss.size, steps[0], steps[1], slideOp());
    }

    if (ss.slide === SLIDE_UP && !ss.seenBlue) {
        ss.tip = 'blue';
    } else if (ss.slide === SLIDE_DOWN && !ss.seenRed) {
        ss.tip = 'red';
    }

    const { grid, door, solution } = pzl;

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

export const onChallenge = (op) => {
    _sound.play('tap');

    ss.challenge = op;
    ss.size = 3;
    loadGame();

    if (ss.cells) {
        onStart();
    } else {
        makePuzzle();
    }

    ss.seenPage[appSubKey()] = true;
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

    delete ss.deadend;
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
                post(() => delete ss.surrender, 1500);
            }
        }, i * 1500);
    }
};

export const starRating = () => {
    if (ss.moves === 0 || !isSolved()) {
        return 0;
    }

    const par = ss.solution?.length || 0;
    const d = ss.moves - par;

    return d < 1 ? 5 : d < 2 ? 4 : d < 3 ? 3 : d < 4 ? 2 : 1;
};

export const whoosh = () => post(() => _sound.play('link1', { rate: 0.8 }), 200);

export const swhoosh = () => post(() => _sound.play('link2', { rate: 0.8 }), 0);

export const showTip = () => ss.challenge > OP_EASY && ss.tip;