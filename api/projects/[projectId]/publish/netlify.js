import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { handlePublish } = require('../../../_storefy-netlify.cjs');

export default handlePublish;
