export const EMPTY = 0, BLOCK = 1, BUBBLE = 2;

// Side-wall doors always slide to top corner under gravity
const normalizeDoor = (d, slide) => { return (d.wall === 1 || d.wall === 3) ? { wall: d.wall, corner: slide < 0 ? 1 : slide > 0 ? 0 : d.corner } : d; };

// ── Door rotation (uses physical corners: TL=0,TR=1,BR=2,BL=3) ──
const toPhysCorner = (wall, corner) => { return [[0, 1], [1, 2], [3, 2], [0, 3]][wall][corner]; };
const fromPhysCorner = (phys, wall) => { return ({ 0: { 0: 0, 3: 0 }, 1: { 0: 1, 1: 0 }, 2: { 1: 1, 2: 1 }, 3: { 2: 0, 3: 1 } })[phys][wall]; };
const rotateDoorCW = (d, slide) => { const np = (toPhysCorner(d.wall, d.corner) + 1) % 4, nw = (d.wall + 1) % 4; return normalizeDoor({ wall: nw, corner: fromPhysCorner(np, nw) }, slide); };
const rotateDoorCCW = (d, slide) => { const np = (toPhysCorner(d.wall, d.corner) + 3) % 4, nw = (d.wall + 3) % 4; return normalizeDoor({ wall: nw, corner: fromPhysCorner(np, nw) }, slide); };

// ── Grid rotation ──
const rotateGridCW = (g, N) => { const ng = Array.from({ length: N }, () => Array(N).fill(0)); for (let r = 0; r < N; r++)for (let c = 0; c < N; c++)ng[c][N - 1 - r] = g[r][c]; return ng; };
const rotateGridCCW = (g, N) => { const ng = Array.from({ length: N }, () => Array(N).fill(0)); for (let r = 0; r < N; r++)for (let c = 0; c < N; c++)ng[N - 1 - c][r] = g[r][c]; return ng; };

// ── Physics ──
const getExitCol = (door, N) => { if (door.wall === 0 || door.wall === 2) return door.corner === 0 ? 0 : N - 1; return null; };

const settleColumn = (col, topExit, botExit) => {
  let c = [...col]; const N = c.length; let ch = true;
  while (ch) {
    ch = false;
    for (let r = 0; r < N; r++) {
      if (c[r] !== BLOCK) continue;
      let nB = 0; for (let i = r + 1; i < N && c[i] === BUBBLE; i++)nB++;
      if (nB >= 2) {
        if (r > 0 && c[r - 1] === EMPTY) { c[r - 1] = BLOCK; c[r] = BUBBLE; c[r + nB] = EMPTY; ch = true; break; }
        else if (r === 0 && topExit) { c[r] = EMPTY; ch = true; break; }
      } else if (nB === 1) {
        if (r + 2 < N && c[r + 2] === EMPTY) { c[r + 2] = BUBBLE; c[r + 1] = BLOCK; c[r] = EMPTY; ch = true; break; }
        else if (r + 1 === N - 1 && botExit) { c[r + 1] = EMPTY; c[r] = EMPTY; ch = true; break; }
      }
    }
    if (ch) continue;
    for (let r = 1; r < N; r++) { if (c[r] === BUBBLE && c[r - 1] === EMPTY) { c[r - 1] = BUBBLE; c[r] = EMPTY; ch = true; break; } }
    if (ch) continue;
    if (topExit && c[0] === BUBBLE) { c[0] = EMPTY; ch = true; continue; }
    for (let r = N - 2; r >= 0; r--) { if (c[r] === BLOCK && c[r + 1] === EMPTY) { c[r + 1] = BLOCK; c[r] = EMPTY; ch = true; break; } }
    if (ch) continue;
    if (botExit && c[N - 1] === BLOCK) { c[N - 1] = EMPTY; ch = true; continue; }
  }
  return c;
};

const applyPhysics = (grid, door, N) => {
  const exitCol = getExitCol(door, N), topExit = door.wall === 0, botExit = door.wall === 2;
  let g = grid.map(r => [...r]);
  for (let c = 0; c < N; c++) {
    const colOut = settleColumn(g.map(r => r[c]), topExit && exitCol === c, botExit && exitCol === c);
    for (let r = 0; r < N; r++)g[r][c] = colOut[r];
  }
  return g;
};

const countPieces = (grid) => { return grid.flat().filter(x => x !== EMPTY).length; };
const gridKey = (grid, door) => { return grid.flat().join('') + '|' + door.wall + door.corner; };
const isStable = (grid, door, N) => { return JSON.stringify(grid) === JSON.stringify(applyPhysics(grid, door, N)); };

// BFS solver — returns shortest move sequence, or null if none within maxDepth
const solve = (grid, door, N, maxDepth, slide = -1) => {
  const initial = applyPhysics(grid, door, N);
  if (countPieces(initial) === 0) return [];
  const queue = [{ grid: initial, door, moves: [] }];
  const visited = new Set([gridKey(initial, door)]);
  while (queue.length > 0) {
    const { grid: g, door: d, moves } = queue.shift();
    if (moves.length >= maxDepth) continue;
    for (const cw of [true, false]) {
      const nd = cw ? rotateDoorCW(d, slide) : rotateDoorCCW(d, slide);
      const rg = cw ? rotateGridCW(g, N) : rotateGridCCW(g, N);
      const sg = applyPhysics(rg, nd, N);
      const nm = [...moves, cw ? 'CW' : 'CCW'];
      if (countPieces(sg) === 0) return nm;
      const key = gridKey(sg, nd);
      if (!visited.has(key)) { visited.add(key); queue.push({ grid: sg, door: nd, moves: nm }); }
    }
  }
  return null;
};

// Dead-end detection — BFS capped at depth 20
export const canSolve = (grid, door, maxDepth = 20, slide = -1) => {
  const N = grid.length;
  if (countPieces(grid) === 0) return true;
  const queue = [{ grid, door, d: 0 }];
  const visited = new Set([gridKey(grid, door)]);
  while (queue.length) {
    const { grid: g, door: dr, d } = queue.shift();
    if (d >= maxDepth) continue;
    for (const cw of [true, false]) {
      const nd = cw ? rotateDoorCW(dr, slide) : rotateDoorCCW(dr, slide);
      const ng = cw ? rotateGridCW(g, N) : rotateGridCCW(g, N);
      const sg = applyPhysics(ng, nd, N);
      if (countPieces(sg) === 0) return true;
      const key = gridKey(sg, nd);
      if (!visited.has(key)) { visited.add(key); queue.push({ grid: sg, door: nd, d: d + 1 }); }
    }
  }
  return false;
};

const makeLCG = (seed) => {
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 0x100000000; };
};

const buildAllDoors = (slide) => { const doors = []; for (let wall = 0; wall < 4; wall++)for (let corner = 0; corner < 2; corner++) { const d = normalizeDoor({ wall, corner }, slide); if (!doors.some(x => x.wall === d.wall && x.corner === d.corner)) doors.push(d); } return doors; };

/**
 * Generate a puzzle with a verified minimal solution in [minMoves, maxMoves].
 *
 * @param {number} N         - Grid size: 2, 3, or 4
 * @param {number} minMoves  - Minimum solution length (inclusive)
 * @param {number} maxMoves  - Maximum solution length (inclusive)
 * @param {number} [seed]    - RNG seed (default: Date.now())
 * @returns {{
 *   grid:     number[][],              // N×N grid, 1=BLOCK, 2=BUBBLE
 *   door:     {wall:number, corner:number},  // wall: 0=top,1=right,2=bottom,3=left; corner: 0=left/top-end, 1=right/bottom-end
 *   solution: string[],                // optimal sequence of 'CW'/'CCW'
 *   par:      number                   // solution.length
 * } | null}  null if no valid puzzle found within search budget
 */
export const generatePuzzle = (N, minMoves, maxMoves, slide = -1, seed = Date.now()) => {
  if (N < 2 || N > 4) throw new Error('N must be 2, 3, or 4');
  if (minMoves < 1) throw new Error('minMoves must be >= 1');
  if (maxMoves < minMoves) throw new Error('maxMoves must be >= minMoves');

  const rand = makeLCG(seed);
  const totalCells = N * N;

  // For N=2,3 enumerate all grids (shuffled). For N=4 sample randomly.
  const ENUMERATE = N <= 3;
  const SAMPLE_SIZE = 5000; // N=4 random candidates to try

  // Produce a shuffled array of all grid bitmasks (N<=3) or random flat arrays (N=4)
  function* gridCandidates() {
    if (ENUMERATE) {
      const total = 1 << totalCells;
      const order = Array.from({ length: total }, (_, i) => i);
      // Fisher-Yates shuffle
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      for (const mask of order) {
        const flat = Array.from({ length: totalCells }, (_, i) => (mask >> i) & 1 ? BLOCK : BUBBLE);
        if (flat.filter(x => x === BLOCK).length < 2 || flat.filter(x => x === BUBBLE).length < 2) continue;
        const grid = Array.from({ length: N }, (_, r) => flat.slice(r * N, r * N + N));
        yield grid;
      }
    } else {
      const seen = new Set();
      let yielded = 0;
      while (yielded < SAMPLE_SIZE) {
        const flat = Array.from({ length: totalCells }, () => rand() < 0.5 ? BLOCK : BUBBLE);
        if (flat.filter(x => x === BLOCK).length < 2 || flat.filter(x => x === BUBBLE).length < 2) continue;
        const key = flat.join('');
        if (seen.has(key)) continue;
        seen.add(key);
        const grid = Array.from({ length: N }, (_, r) => flat.slice(r * N, r * N + N));
        yield grid;
        yielded++;
      }
    }
  }

  // Shuffle door order independently per candidate
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
      if (!isStable(grid, door, N)) continue;
      const sol = solve(grid, door, N, Math.min(maxMoves, 15), slide);
      if (!sol || sol.length < minMoves) continue;
      // sol.length <= maxMoves is guaranteed by solve's maxDepth
      return { grid, door, solution: sol, par: sol.length };
    }
  }

  return null;
};
