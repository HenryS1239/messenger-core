import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from '@src/imports/database';
import { LOG_TYPES, SEVERITIES } from '@src/constants';

type IRelations = {
    user?: any,
}

@Injectable()
export class SyslogService {

    private readonly logger = new Logger(SyslogService.name);

    constructor(private readonly database: DatabaseService) {
    }


    public get audit() {
        return this.section(LOG_TYPES.AUDIT);
    }

    public get system() {
        return this.section(LOG_TYPES.SYSTEM);
    }

    // ---
    private section(type: string) {
        return {
            debug: (message: string, metadata?: any) => this.logging(message, type, SEVERITIES.DEBUG, metadata),
            info: (message: string, metadata?: any) => this.logging(message, type, SEVERITIES.INFO, metadata),
            notice: (message: string, metadata?: any) => this.logging(message, type, SEVERITIES.NOTICE, metadata),
            emergency: (message: string, metadata?: any) => this.logging(message, type, SEVERITIES.EMERGENCY, metadata),
            warning: (message: string, metadata?: any) => this.logging(message, type, SEVERITIES.WARNING, metadata),
            error: (message: string, metadata?: any) => this.logging(message, type, SEVERITIES.ERROR, metadata),
            critical: (message: string, metadata?: any) => this.logging(message, type, SEVERITIES.CRITICAL, metadata),
            alert: (message: string, metadata?: any) => this.logging(message, type, SEVERITIES.ALERT, metadata),
        };
    }

    private logging(message: string, type: string, severity: string, metadata?: any) {
        // non-block write
        this.database.Log.create({
            timestamp: new Date(),
            type,
            severity,
            message,
            _metadata: metadata,
        }).then().catch(err => {
            this.logger.error(`failed write into log database: [${err.message}]`);
        });
    }
}
