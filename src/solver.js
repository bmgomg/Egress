// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------
const BLOCK = 'B';
const BUBBLE = 'O';
const EMPTY = '.';

const MOVES = ['CW', 'CCW'];

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
const cloneGrid = (g) => {
    return g.map(r => r.slice());
};

const gridToString = (g) => {
    return g.map(r => r.join('')).join('\n');
};

const isEmptyGrid = (g) => {
    return g.every(row => row.every(c => c === EMPTY));
};

const rotateCW = (g) => {
    const N = g.length;
    const r = Array.from({ length: N }, () => Array(N).fill(EMPTY));
    for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++)
            r[x][N - 1 - y] = g[y][x];
    return r;
};

const rotateCCW = (g) => {
    const N = g.length;
    const r = Array.from({ length: N }, () => Array(N).fill(EMPTY));
    for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++)
            r[N - 1 - x][y] = g[y][x];
    return r;
};

// ------------------------------------------------------------
// Gravity + door exit (gravity always DOWN in world coords)
// ------------------------------------------------------------
const applyGravityWithDoor = (grid, door) => {
    const N = grid.length;
    const g = cloneGrid(grid);

    const isHeavy = c => c === BLOCK;
    const isLight = c => c === BUBBLE;

    const isDoorExit = (y, x, dy, dx) => {
        const ny = y + dy;
        const nx = x + dx;

        if (door.side === 'left' && nx < 0 && y === door.index) return true;
        if (door.side === 'right' && nx >= N && y === door.index) return true;
        if (door.side === 'top' && ny < 0 && x === door.index) return true;
        if (door.side === 'bottom' && ny >= N && x === door.index) return true;

        return false;
    };

    const moveCell = (y, x, dy, dx) => {
        const c = g[y][x];
        if (c === EMPTY) return;

        let cy = y, cx = x;

        while (true) {
            const ny = cy + dy;
            const nx = cx + dx;

            if (ny < 0 || ny >= N || nx < 0 || nx >= N) {
                if (isDoorExit(cy, cx, dy, dx)) g[cy][cx] = EMPTY;
                break;
            }

            if (g[ny][nx] !== EMPTY) break;

            cy = ny;
            cx = nx;
        }

        if (cy !== y || cx !== x) {
            g[cy][cx] = c;
            g[y][x] = EMPTY;
        }
    };

    // Heavy moves down, light moves up
    for (let y = N - 2; y >= 0; y--)
        for (let x = 0; x < N; x++)
            if (isHeavy(g[y][x])) moveCell(y, x, +1, 0);

    for (let y = 1; y < N; y++)
        for (let x = 0; x < N; x++)
            if (isLight(g[y][x])) moveCell(y, x, -1, 0);

    return g;
};

// ------------------------------------------------------------
// Apply a rotation move (CW or CCW) + gravity
// ------------------------------------------------------------
const applyMove = (grid, orientation, move, door) => {
    let newOrientation = orientation;
    let rotated = grid;

    if (move === 'CW') {
        rotated = rotateCW(rotated);
        newOrientation = (orientation + 1) % 4;
    } else {
        rotated = rotateCCW(rotated);
        newOrientation = (orientation + 3) % 4;
    }

    const afterGravity = applyGravityWithDoor(rotated, door);
    return { grid: afterGravity, orientation: newOrientation };
};

// ------------------------------------------------------------
// BFS solver (minimal CW/CCW sequence)
// ------------------------------------------------------------
const solveMinimal = (grid, door) => {
    const startKey = gridToString(grid) + '|0';
    const visited = new Set([startKey]);
    const queue = [{ grid, orientation: 0, path: [] }];

    while (queue.length) {
        const { grid: g, orientation, path } = queue.shift();

        if (isEmptyGrid(g)) return path;

        for (const move of MOVES) {
            const next = applyMove(g, orientation, move, door);
            const key = gridToString(next.grid) + '|' + next.orientation;

            if (visited.has(key)) continue;
            visited.add(key);

            queue.push({
                grid: next.grid,
                orientation: next.orientation,
                path: [...path, move]
            });
        }
    }

    return null;
};

// ------------------------------------------------------------
// Random grid + door
// ------------------------------------------------------------
const randomDoor = (size) => {
    const sides = ['left', 'right', 'top', 'bottom'];
    return {
        side: sides[Math.floor(Math.random() * sides.length)],
        // index: Math.floor(Math.random() * size)
        index: 1 + ((Date.now() % 2) ? 1 : -1)
    };
};

const randomGrid = (size) => {
    const g = [];
    for (let y = 0; y < size; y++) {
        const row = [];
        for (let x = 0; x < size; x++) {
            row.push(Math.random() < 0.5 ? BLOCK : BUBBLE);
        }
        g.push(row);
    }
    return g;
};

const isStableStart = (grid, door) => {
    if (door.side === 'left' || door.side === 'right') {
        return true;
    }

    const col = door.index;

    if (door.side === 'top') {
        if (grid[0][col] === 'O') {
            return false;
        }

        if (grid[1][col] === 0 && grid[2][col] === 0) {
            return false;
        }

        return true;
    }

    if (door.side === 'bottom') {
        if (grid[1][col] === 'B' || grid[2][col] === 'B') {
            return false;
        }

        return true;
    }

    const N = grid.length;
    const dirs = ['CW', 'CCW'];
    for (const m of dirs) {
        const next = applyMove(grid, 0, m, door).grid;
        if (gridToString(next) !== gridToString(grid)) return false;
    }
    return true;
};

// ------------------------------------------------------------
// Main generator for SIZE = 2, 3, or 4
// ------------------------------------------------------------
export const generatePuzzle = (size) => {
    if (size < 2 || size > 4) throw new Error('SIZE must be 2, 3, or 4');

    while (true) {
        const grid = randomGrid(size);
        const door = randomDoor(size);

        if (!isStableStart(grid, door)) continue;

        const solution = solveMinimal(grid, door);
        if (!solution || solution.length === 0) continue;

        return { size, grid, door, solution };
    }
};

// ------------------------------------------------------------
// Example
// ------------------------------------------------------------
// const puzzle = generatePuzzle(4);
// console.log("Door:", puzzle.door);
// console.log("Solution (CW/CCW):", puzzle.solution);
// console.table(puzzle.grid);