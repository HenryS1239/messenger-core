import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/imports/database';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';

@Injectable()
export class GcProcess {
    private readonly logger = new Logger(GcProcess.name);

    constructor(private readonly database: DatabaseService) {}

    @Cron(CronExpression.EVERY_DAY_AT_10AM)
    private async clearBannedToken() {
        const threshold = moment().subtract(90, 'days').toDate();
        const rs = await this.database.BannedToken.deleteMany({ createdAt: { $lt: threshold } });
        if (rs.deletedCount) {
            this.logger.verbose(`removed ${rs.deletedCount} banned token created before ${threshold.toISOString()}`);
        }
    }
}
