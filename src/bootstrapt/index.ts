import { APP_ENVIRONMENT, CORS_ORIGINS, DIR_DATA, DIR_TEMP } from '../config';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as fs from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';

import { DefaultLogger } from '@src/imports/logger';

export const createApp = async <T extends INestApplication>(App): Promise<T> => {
    const isDevelopment = APP_ENVIRONMENT === 'development';
    const app = await NestFactory.create<T>(App, {
        ...(isDevelopment ? null : ({ logger: ['warn', 'error', 'verbose'] } as any)),
        bufferLogs: true,
    });
    app.enableShutdownHooks();

    app.useLogger(app.get(DefaultLogger));

    for (const dir of [DIR_DATA, DIR_TEMP]) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    return app;
};

export const createWebApp = async (App) => {
    const app = await createApp<NestExpressApplication>(App);

    const corsOrigin = CORS_ORIGINS ? CORS_ORIGINS.split(',').map((c) => c.trim()) : [];
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
    app.enableCors({
        origin: corsOrigin,
    });
    app.useGlobalPipes(new ValidationPipe());

    app.setBaseViewsDir(path.join(__dirname, '..', 'modules', 'views'));
    app.useStaticAssets(path.join(__dirname, '..', 'public'));

    return app;
};
