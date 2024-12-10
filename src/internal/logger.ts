import { blue, bold, red, yellow } from "colorette";
import { PACKAGE_NAME } from "./constants.js";

class Logger {

	#log(message: string) {
		console.log(`${blue(`[${PACKAGE_NAME}]`)} ${bold(message)}`);
	}

	info(message: string) {
		this.#log(message);
	}

	warn(message: string) {
		this.#log(yellow(message));
	}

	error(message: string) {
		this.#log(red(message));
	}
}

export const logger = new Logger();