import { BLOCK, BUBBLE, EMPTY, NO_SLIDE } from './const';

const toPhysCorner = (wall, corner) => [[0, 1], [1, 2], [3, 2], [0, 3]][wall][corner];

const fromPhysCorner = (phys, wall) => ({ 0: { 0: 0, 3: 0 }, 1: { 0: 1, 1: 0 }, 2: { 1: 1, 2: 1 }, 3: { 2: 0, 3: 1 } })[phys][wall];

// side-wall doors slide to a fixed corner based on slide direction.
// slide < 0 => gap at bottom (corner = 1)
// slide > 0 => gap at top (corner = 0)
// slide = 0 => fixed, stays where it lands
const normalizeDoor = (door, slide) => {
    const { wall } = door;

    if (wall !== 1 && wall !== 3) {
        return door;
    }

    if (slide === NO_SLIDE) {
        return door;
    }

    return { wall, corner: slide < 0 ? 1 : 0 };
};

const rotateDoorCW = (door, slide) => {
    const np = (toPhysCorner(door.wall, door.corner) + 1) % 4;
    const nw = (door.wall + 1) % 4;

    return normalizeDoor({ wall: nw, corner: fromPhysCorner(np, nw) }, slide);
};

const rotateDoorCCW = (door, slide) => {
    const np = (toPhysCorner(door.wall, door.corner) + 3) % 4;
    const nw = (door.wall + 3) % 4;

    return normalizeDoor({ wall: nw, corner: fromPhysCorner(np, nw) }, slide);
};

const rotateGridCW = (grid, N) => {
    const ng = Array.from({ length: N }, () => Array(N).fill(0));

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            ng[c][N - 1 - r] = grid[r][c];
        }
    }

    return ng;
};

const rotateGridCCW = (grid, N) => {
    const ng = Array.from({ length: N }, () => Array(N).fill(0));

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            ng[N - 1 - c][r] = grid[r][c];
        }
    }

    return ng;
};

const getExitCol = (door, N) => {
    if (door.wall !== 0 && door.wall !== 2) {
        return null;
    }

    return door.corner === 0 ? 0 : N - 1;
};

const settleColumn = (col, topExit, botExit) => {
    const c = [...col];
    const N = c.length;
    let changed = true;

    while (changed) {
        changed = false;

        // block on 2+ bubbles => rises
        for (let r = 0; r < N; r++) {
            if (c[r] !== BLOCK) {
                continue;
            }

            let nBubbles = 0;

            for (let i = r + 1; i < N && c[i] === BUBBLE; i++) {
                nBubbles++;
            }

            if (nBubbles >= 2) {
                if (r > 0 && c[r - 1] === EMPTY) {
                    c[r - 1] = BLOCK;
                    c[r] = BUBBLE;
                    c[r + nBubbles] = EMPTY;
                    changed = true;
                    break;
                } else if (r === 0 && topExit) {
                    c[r] = EMPTY;
                    changed = true;
                    break;
                }
            } else if (nBubbles === 1) {
                // block on 1 bubble => falls together
                if (r + 2 < N && c[r + 2] === EMPTY) {
                    c[r + 2] = BUBBLE;
                    c[r + 1] = BLOCK;
                    c[r] = EMPTY;
                    changed = true;
                    break;
                } else if (r + 1 === N - 1 && botExit) {
                    c[r + 1] = EMPTY;
                    c[r] = EMPTY;
                    changed = true;
                    break;
                }
            }
        }

        if (changed) {
            continue;
        }

        // lone bubble rises
        for (let r = 1; r < N; r++) {
            if (c[r] === BUBBLE && c[r - 1] === EMPTY) {
                c[r - 1] = BUBBLE;
                c[r] = EMPTY;
                changed = true;
                break;
            }
        }

        if (changed) {
            continue;
        }

        // bubble exits top
        if (topExit && c[0] === BUBBLE) {
            c[0] = EMPTY;
            changed = true;
            continue;
        }

        // lone block falls
        for (let r = N - 2; r >= 0; r--) {
            if (c[r] === BLOCK && c[r + 1] === EMPTY) {
                c[r + 1] = BLOCK;
                c[r] = EMPTY;
                changed = true;
                break;
            }
        }

        if (changed) {
            continue;
        }

        // block exits bottom
        if (botExit && c[N - 1] === BLOCK) {
            c[N - 1] = EMPTY;
            changed = true;
        }
    }

    return c;
};

const applyPhysics = (grid, door, N) => {
    const exitCol = getExitCol(door, N);
    const topExit = door.wall === 0;
    const botExit = door.wall === 2;
    const g = grid.map((r) => [...r]);

    for (let c = 0; c < N; c++) {
        const col = settleColumn(g.map((r) => r[c]), topExit && exitCol === c, botExit && exitCol === c);

        for (let r = 0; r < N; r++) {
            g[r][c] = col[r];
        }
    }

    return g;
};

const countPieces = (grid) => grid.flat().filter((x) => x !== EMPTY).length;

const gridKey = (grid, door) => grid.flat().join('') + '|' + door.wall + door.corner;

const isStable = (grid, door, N) => JSON.stringify(grid) === JSON.stringify(applyPhysics(grid, door, N));

// BFS — returns optimal move sequence, or null if none within maxDepth
const solve = (grid, door, N, maxDepth, slide = NO_SLIDE) => {
    const initial = applyPhysics(grid, door, N);

    if (countPieces(initial) === 0) {
        return [];
    }

    const queue = [{ grid: initial, door, moves: [] }];
    const visited = new Set([gridKey(initial, door)]);

    while (queue.length > 0) {
        const { grid: g, door: d, moves } = queue.shift();

        if (moves.length >= maxDepth) {
            continue;
        }

        for (const cw of [true, false]) {
            const nd = cw ? rotateDoorCW(d, slide) : rotateDoorCCW(d, slide);
            const rg = cw ? rotateGridCW(g, N) : rotateGridCCW(g, N);
            const sg = applyPhysics(rg, nd, N);
            const nm = [...moves, cw ? 'CW' : 'CCW'];

            if (countPieces(sg) === 0) {
                return nm;
            }

            const key = gridKey(sg, nd);

            if (!visited.has(key)) {
                visited.add(key);
                queue.push({ grid: sg, door: nd, moves: nm });
            }
        }
    }

    return null;
};

// dead-end detection — BFS capped at maxdepth
export const canSolve = (grid, door, slide = NO_SLIDE, maxDepth = 20) => {
    const N = grid.length;

    if (countPieces(grid) === 0) {
        return true;
    }

    const queue = [{ grid, door, depth: 0 }];
    const visited = new Set([gridKey(grid, door)]);

    while (queue.length) {
        const { grid: g, door: dr, depth } = queue.shift();

        if (depth >= maxDepth) {
            continue;
        }

        for (const cw of [true, false]) {
            const nd = cw ? rotateDoorCW(dr, slide) : rotateDoorCCW(dr, slide);
            const ng = cw ? rotateGridCW(g, N) : rotateGridCCW(g, N);
            const sg = applyPhysics(ng, nd, N);

            if (countPieces(sg) === 0) {
                return true;
            }

            const key = gridKey(sg, nd);

            if (!visited.has(key)) {
                visited.add(key);
                queue.push({ grid: sg, door: nd, depth: depth + 1 });
            }
        }
    }

    return false;
};

const makeLCG = (seed) => {
    let s = seed >>> 0;

    return () => {
        s = (Math.imul(1664525, s) + 1013904223) >>> 0;
        return s / 0x100000000;
    };
};

const buildAllDoors = (slide) => {
    const doors = [];

    for (let wall = 0; wall < 4; wall++) {
        for (let corner = 0; corner < 2; corner++) {
            const d = normalizeDoor({ wall, corner }, slide);

            if (!doors.some((x) => x.wall === d.wall && x.corner === d.corner)) {
                doors.push(d);
            }
        }
    }

    return doors;
};

/**
 * Generate a puzzle with a verified optimal solution in [minMoves, maxMoves].
 *
 * @param {number}    N        - Grid size (2 or 3)
 * @param {number}    minMoves - Minimum solution length (inclusive)
 * @param {number}    maxMoves - Maximum solution length (inclusive)
 * @param {number}    slide    - Door slide: NO_SLIDE=0, SLIDE_UP=-1, SLIDE_DOWN=1
 * @param {number}    [seed]   - RNG seed (default: Date.now())
 * @returns {{ grid, door, solution, par } | null}
 */
export const generatePuzzle = (N, minMoves, maxMoves, slide = NO_SLIDE, seed = Date.now()) => {
    if (N < 2 || N > 3) {
        throw new Error('N must be 2 or 3');
    }

    if (minMoves < 1) {
        throw new Error('minMoves must be >= 1');
    }

    if (maxMoves < minMoves) {
        throw new Error('maxMoves must be >= minMoves');
    }

    const rand = makeLCG(seed);
    const totalCells = N * N;

    function* gridCandidates() {
        const total = 1 << totalCells;
        const order = Array.from({ length: total }, (_, i) => i);

        for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
        }

        for (const mask of order) {
            const flat = Array.from({ length: totalCells }, (_, i) => ((mask >> i) & 1 ? BLOCK : BUBBLE));
            const blocks = flat.filter((x) => x === BLOCK).length;
            const bubbles = flat.filter((x) => x === BUBBLE).length;

            if (blocks < 2 || bubbles < 2) {
                continue;
            }

            yield Array.from({ length: N }, (_, r) => flat.slice(r * N, r * N + N));
        }
    }

    const shuffledDoors = () => {
        const doors = buildAllDoors(slide);

        for (let i = doors.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [doors[i], doors[j]] = [doors[j], doors[i]];
        }

        return doors;
    };

    for (const grid of gridCandidates()) {
        for (const door of shuffledDoors()) {
            if (!isStable(grid, door, N)) {
                continue;
            }

            const solution = solve(grid, door, N, Math.min(maxMoves, 15), slide);

            if (!solution || solution.length < minMoves) {
                continue;
            }

            return { grid, door, solution, par: solution.length };
        }
    }

    return null;
};