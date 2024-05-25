import dev from './dev.js';
import build from './build.js';

export default function pagefind() {
	return [dev(), build()];
}
