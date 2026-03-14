import { SLIDE_DOWN, SLIDE_UP } from './const';

export const ss = $state({
    home: true,
    seenPage: {},
    slide: SLIDE_UP,
});

export const _stats = $state({
    plays: 0,
    wins: 0,
    total: 0,
});