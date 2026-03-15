import { NO_SLIDE, SLIDE_DOWN } from './const';

export const ss = $state({
    home: false,
    seenPage: {},
    slide: NO_SLIDE,
});

export const _stats = $state({
    plays: 0,
    wins: 0,
    total: 0,
});