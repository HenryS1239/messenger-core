import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@src/imports/database';

import { SettingService } from '@src/imports/util';

@Injectable()
export class ImportService {

    private readonly logger = new Logger(ImportService.name);

    constructor(private readonly database: DatabaseService, private readonly setting: SettingService) {
    }
}
