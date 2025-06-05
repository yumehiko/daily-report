import { readFileSync } from 'fs';
export default JSON.parse(readFileSync(new URL('./.eslintrc.json', import.meta.url)));
