import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { AdminAuthGuard } from '@src/imports/auth';
import { DatabaseService } from '@src/imports/database';
import * as moment from 'moment';

@ApiTags('Core:Log')
@Controller('/api/core/logs')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
export class LogsController {
    constructor(private readonly database: DatabaseService) {}

    @ApiQuery({ name: 'offset', type: Number, required: true })
    @ApiQuery({ name: 'limit', type: Number, required: true })
    @ApiQuery({ name: 'types', type: String, required: false })
    @ApiQuery({
        name: 'timestamps',
        type: String,
        required: false,
        description: 'YYYY-MM-DD,YYYY-MM-DD',
    })
    @ApiQuery({
        name: 'severities',
        type: String,
        required: false,
        description: 'split with comma',
    })
    @Get('')
    @UseGuards(AdminAuthGuard)
    async list(@Query() { offset, limit, types, timestamps, severities }) {
        const query: any = {};

        if (timestamps) {
            const parts = timestamps.split(',');
            query.timestamp = {
                $gte: moment(parts[0]).toDate(),
                $lte: moment(parts[1]).toDate(),
            };
        }

        if (severities) {
            const parts = severities.toUpperCase().split(',');
            query.severity = { $in: parts };
        }

        if (types) {
            const parts = types.split(',');
            query.type = { $in: parts };
        }

        const total = await this.database.Log.countDocuments(query);
        const items = await this.database.Log.find(query).skip(parseInt(offset)).limit(parseInt(limit)).sort('-timestamp');

        return { total, items };
    }
}
