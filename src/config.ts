import * as dotEnv from 'dotenv';
import { Logger } from '@nestjs/common';
import * as path from 'path';

const logger = new Logger('CONFIG');

dotEnv.config();

process.env.DIR_ROOT = path.join(__dirname, '..');
if (!process.env.DIR_STORAGE) {
    process.env.DIR_STORAGE = path.join(process.env.DIR_ROOT, 'storage');
}
process.env.DIR_TEMP = path.join(process.env.DIR_STORAGE, 'temp');
process.env.DIR_LOGS = path.join(process.env.DIR_STORAGE, 'logs');
process.env.DIR_DATA = path.join(process.env.DIR_STORAGE, 'data');
process.env.DIR_REPORTS = path.join(process.env.DIR_DATA, 'reports');
process.env.DIR_EXPORTS = path.join(process.env.DIR_DATA, 'exports');

process.env.INIT_FILE = path.join(process.env.DIR_DATA, 'init.json');

const CONFIG = Object.assign(
    {
        APP_ENVIRONMENT: 'production',
        APP_PORT: 3000,

        LOG_LEVEL: 'info',
        LOG_DAILY_ROTATE_DAYS: 7,
        LOG_DAILY_ROTATE_SIZE_MB: 20,

        FORGET_PASSWORD_EXPIRY_MINUTES: 5,

        // AUTH_USER_SECRET: undefined, // require set
        AUTH_USER_SECRET: process.env.AUTH_USER_SECRET,
        AUTH_USER_TOKEN_EXPIRY_MINUTES: 30 * 24 * 60, //15, // 24 hours
        AUTH_USER_REFRESH_TOKEN_EXPIRY_MINUTES: 365 * 24 * 60, // 365 days
        AUTH_USER_FORGET_PASSWORD_CODE_EXPIRY_MINUTES: 10,
        AUTH_USER_ALLOWED_MULTI_LOGIN: false,

        PDF_GENERATOR_TIMEOUT: 10000,
    },
    process.env,
);

export const {
    APP_ENVIRONMENT,
    APP_PORT,
    APP_NAME,
    CORS_ORIGINS,
    FILE_DRIVER,
    DIR_ROOT,
    DIR_STORAGE,
    DIR_TEMP,
    DIR_LOGS,

    DIR_DATA,

    TIMEZONE,

    CIPHER_ALGORITHM,
    CIPHER_KEY,

    MONGO_URI,

    SERVER_HOST,

    FILE_DIR_REPORTS,
    FILE_DIR_EXPORTS,
    FILE_DIR_ATTACHMENTS,
    FILE_DIR_PROJECTS,

    FILE_DIR_SITEMEMO,

    LOG_LEVEL,
    LOG_DAILY_ROTATE_SIZE_MB,
    LOG_DAILY_ROTATE_DAYS,

    CLIENT_IP_HEADER,

    AUTH_USER_SECRET,
    AUTH_USER_TOKEN_EXPIRY_MINUTES,
    AUTH_USER_REFRESH_TOKEN_EXPIRY_MINUTES,
    AUTH_USER_FORGET_PASSWORD_CODE_EXPIRY_MINUTES,
    AUTH_USER_ALLOWED_MULTI_LOGIN,

    API_URI,
} = CONFIG;

logger.debug(`loaded .env config file, environment [${APP_ENVIRONMENT}]`);
if (APP_ENVIRONMENT === 'development') {
    const values = {
        APP_PORT,
        APP_NAME,
        DIR_ROOT,
    };
    for (const k of Object.keys(values)) {
        logger.debug(`${k} => [${values[k]}]`);
    }
}
