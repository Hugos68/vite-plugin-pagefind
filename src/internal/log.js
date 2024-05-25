import { blue, bold, red, yellow } from "colorette";
import { PACKAGE_NAME } from "./constants.js";

/**
 * Logs a message to the console.
 * @param {string} message - The message to log.
 */
export function log_info(message) {
	console.log(`${blue(`[${PACKAGE_NAME}]`)} ${bold(message)}`);
}

/**
 * Logs a warning to the console.
 * @param {string} message - The warning message to log.
 */
export function log_warn(message) {
	console.warn(`${blue(`[${PACKAGE_NAME}]`)} ${bold(red(message))}`);
}

/**
 * Logs an error to the console.
 * @param {string} message - The error message to log.
 */
export function log_error(message) {
	console.error(`${blue(`[${PACKAGE_NAME}]`)} ${bold(yellow(message))}`);
}
