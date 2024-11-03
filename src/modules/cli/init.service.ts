import { Injectable, Logger } from '@nestjs/common';

import { DIR_DATA, DIR_STORAGE, DIR_TEMP } from '@src/config';
import * as fs from 'fs';

@Injectable()
export class InitService {

    private readonly logger = new Logger(InitService.name);

    public async createFolders() {
        for (const dir of [DIR_STORAGE, DIR_DATA, DIR_TEMP]) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                this.logger.log(`created folder ${dir}`);
            }
        }
    }
}
