import { SLIDE_DOWN } from './const';

export const ss = $state({
    home: true,
    seenPage: {},
    slide: SLIDE_DOWN,
});

export const _stats = $state({
    plays: 0,
    wins: 0,
    total: 0,
});