'use strict';

import rl from './readline.js';
import { showMenu } from './menu/menu.js';
import state from './state.js';

export const readUserKey = () => {
    return new Promise((resolve) => {
        rl.input.once('keypress', (key, info) => {
            resolve(info.sequence);
        })
    })
}

export async function readUserLine(question) {
    rl.clearLine(rl.input, 1); // clear the current line
    console.clear();
    return new Promise((resolve) => {
        rl.question(question, function (answer) {
            resolve(answer);
        })
    })
}

export async function clickAnyKeyToContinue() {
    console.log('Click any key to continue...');
    await readUserKey();
    showMenu({ menuName: state.currentMenuName, clear: true });
}