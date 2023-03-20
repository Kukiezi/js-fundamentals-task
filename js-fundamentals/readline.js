'use strict';

import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

// create singleton readline interface
const rl = readline.createInterface({ input, output });
// Set the input stream to "raw mode" so keypress events are emitted immediately
rl.input.setRawMode(true);
rl.prompt();

export default rl;