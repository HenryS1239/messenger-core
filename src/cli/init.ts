import { NestFactory } from '@nestjs/core';

import { CliModule, SeederService, InitService } from '@src/modules/cli';
import { Logger } from '@nestjs/common';

const logger = new Logger('CLI_INIT');

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(CliModule);
    const init = app.get(InitService);
    const seeder = app.get(SeederService);
    try {
        await init.createFolders();
        await seeder.data();
    } catch (e) {
        logger.error(e.stack);
    } finally {
        await app.close();
    }
}

bootstrap()
    .then(() => logger.verbose('finished'))
    .finally(() => process.exit(0));
