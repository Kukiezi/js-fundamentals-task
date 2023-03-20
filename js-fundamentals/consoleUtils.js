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

export function clearConsole() {
    rl.clearLine(rl.input, 1); // clear the current line
    console.clear();
}

// readUserLine function with custom validation function
export async function readUserLine(question, validate = () => { return { success: true } } ) {
    return new Promise((resolve) => {
        rl.question(question, function (answer) {
            const validationResult = validate(answer);
            if (validationResult.success) {
                resolve(answer);
            } else {    
                console.log(validationResult.error);
                resolve(readUserLine(question, validate));
            }
        })
    })
}

export async function clickAnyKeyToContinue() {
    console.log('Click any key to continue...');
    await readUserKey();
    showMenu({ menuName: state.currentMenuName, clear: true });
}