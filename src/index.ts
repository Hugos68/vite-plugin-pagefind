import dev from './dev.js';
import build from './build.js';
import { PluginOption } from 'vite';

export default function pagefind(): PluginOption {
	return [dev(), build()];
}
