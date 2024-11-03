import { Logger } from '@nestjs/common';
import { createWebApp } from '../index';
import { AppApiModule } from './app-api.module';
import { APP_PORT } from '@src/config';

const logger = new Logger('api-admin-bootstrap');

async function bootstrap() {
    const app = await createWebApp(AppApiModule);

    await app.listen(APP_PORT, '0.0.0.0');
    logger.verbose(`application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => logger.error(err.stack));
