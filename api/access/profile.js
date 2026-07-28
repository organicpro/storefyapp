import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { getProfile } = require('../_storefy-levels.cjs');

export default getProfile;
