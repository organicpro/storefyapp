import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { handleValidate } = require('../../../_storefy-netlify.cjs');

export default handleValidate;
