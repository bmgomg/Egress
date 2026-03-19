import sounds from '$lib/sounds/sfx.mp3';
import music from '$lib/sounds/music.mp3';
import Line1 from '$lib/sounds/Line 1.mp3';
import Line2 from '$lib/sounds/Line 2.mp3';
import Line3 from '$lib/sounds/Line 3.mp3';
import Line4 from '$lib/sounds/Line 4.mp3';
import Line5 from '$lib/sounds/Line 5.mp3';
import Line6 from '$lib/sounds/Line 6.mp3';
import Line7 from '$lib/sounds/Line 7.mp3';
import Line8 from '$lib/sounds/Line 8.mp3';
import Line9 from '$lib/sounds/Line 9.mp3';
import Line10 from '$lib/sounds/Line 10.mp3';
import Line11 from '$lib/sounds/Line 11.mp3';
import Line12 from '$lib/sounds/Line 12.mp3';
import Line13 from '$lib/sounds/Line 13.mp3';
import Line14 from '$lib/sounds/Line 14.mp3';
import { Howl } from 'howler/dist/howler.core.min';

const sprite = {
    click: [0, 160],
    cluck: [230, 180],
    coin1: [430, 440],
    coin2: [930, 440],
    coins: [1400, 1054],
    dice: [3020, 910],
    draw: [3980, 1750],
    drop: [5750, 600],
    link1: [6400, 420],
    link2: [6900, 420],
    lost: [7370, 680],
    plop: [8130, 220],
    player1wins: [8430, 1540],
    player2wins: [10030, 1700],
    score1: [11780, 260],
    score2: [12080, 310],
    tap: [12430, 210],
    won: [12680, 2010],
};

const howl = new Howl({ src: [sounds], sprite });
const loop = new Howl({ src: [music], loop: true, volume: 0.6 });
const v1 = new Howl({ src: Line1 });
const v2 = new Howl({ src: Line2 });
const v3 = new Howl({ src: Line3 });
const v4 = new Howl({ src: Line4 });
const v5 = new Howl({ src: Line5 });
const v6 = new Howl({ src: Line6 });
const v7 = new Howl({ src: Line7 });
const v8 = new Howl({ src: Line8 });
const v9 = new Howl({ src: Line9 });
const v10 = new Howl({ src: Line10 });
const v11 = new Howl({ src: Line11 });
const v12 = new Howl({ src: Line12 });
const v13 = new Howl({ src: Line13 });
const v14 = new Howl({ src: Line14 });
const LINES = [v1, v2, v10, v13, v14];

export const _sound = $state({
    sfx: true,
    music: true,
    play: (id, options = {}) => {
        const { rate = 1, volume = 1 } = options;

        if (_sound.sfx) {
            howl.play(id);
            howl.rate(rate);
            howl.volume(volume);
        }
    },
    tap: () => howl.play('tap'),
    playMusic: () => {
        if (_sound.music) {
            _sound.musicPlayed = true;
            // loop.play();
        }
    },
    stopMusic: () => {
        loop.stop();
    },
    playVoice: (l) => {
        LINES[l - 1].play();
    }
});
