import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { handleSave } = require('../../../_storefy-netlify.cjs');

export default handleSave;
