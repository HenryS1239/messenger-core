import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BinService, CliModule } from '@src/modules/cli';
import * as config from '@src/config';

const logger = new Logger('CLI_BIN');

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(CliModule);
    const [, , command] = process.argv;
    try {
        const bin = app.get(BinService);

        switch (command) {
            case 'cache:clear': {
                logger.verbose(`clearing all cache ....`);
                break;
            }
            case 'db:indexes': {
                await bin.db.indexes();
                break;
            }
            case 'config:show': {
                Object.keys(config).forEach((k) => logger.verbose(`${k} => [${config[k]}]`));
                break;
            }
            default:
                logger.warn(`unknown command ${command}`);
        }
    } catch (e) {
        logger.error(e.stack);
    } finally {
        await app.close();
    }
}

bootstrap()
    .then(() => logger.log('finished'))
    .finally(() => process.exit(0));
