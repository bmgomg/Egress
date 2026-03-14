import { SLIDE_DOWN } from './generator';

export const ss = $state({
    home: true,
    seenPage: {},
    doopSlide: SLIDE_DOWN,
});

export const _stats = $state({
    plays: 0,
    wins: 0,
    total: 0,
});