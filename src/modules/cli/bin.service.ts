import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@src/imports/database';

@Injectable()
export class BinService {
    private readonly logger = new Logger(BinService.name);

    constructor(private readonly database: DatabaseService) {}

    public get db() {
        return {
            indexes: async () => {
                this.logger.log(`sync indexes for users schema .....`);
                await this.database.User.syncIndexes();
            },
        };
    }
}
