import { blue, bold } from 'colorette';
import { PACKAGE_NAME } from './constants.js';

export function console_log(input: string) {
	console.log(`${blue(`[${PACKAGE_NAME}]`)} ${bold(input)}`);
}
