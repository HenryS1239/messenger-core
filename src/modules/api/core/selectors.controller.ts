import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@src/imports/auth';
import { DatabaseService } from '@src/imports/database';

@ApiTags('Core:Selectors')
@ApiBearerAuth()
@Controller('/api/core/selectors')
export class SelectorsController {
    constructor(private readonly database: DatabaseService) {}

    @Get(':key')
    @UseGuards(AdminAuthGuard)
    async list(@Param('key') key, @Query() { offset, limit, sort }) {
        const query: any = { key };
        const total = await this.database.Selectors.countDocuments(query);
        const items = await this.database.Selectors.find(query)
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .sort(sort ? sort : 'order');
        return {
            total,
            items,
        };
    }

    @Get(':key/:id')
    @UseGuards(AdminAuthGuard)
    async get(@Param('key') key, @Param('id') id) {
        const rs = await this.database.Selectors.findOne({ key, _id: id });
        if (!rs) {
            throw new NotFoundException();
        }
        return rs;
    }

    @Post(':key')
    @UseGuards(AdminAuthGuard)
    async add(@Param('key') key, @Body() body) {
        return this.database.Selectors.create({ key, value: body.value });
    }

    @Put(':key/:id')
    @UseGuards(AdminAuthGuard)
    async set(@Param('key') key, @Param('id') id, @Body() body) {
        const r = await this.database.Selectors.findOne({ key, _id: id });
        if (!r) {
            throw new NotFoundException();
        }
        await this.database.Selectors.updateOne({ _id: r._id }, { $set: { value: body.value } });
        return await this.database.Selectors.findOne({ _id: r._id });
    }

    @Delete(':key/:id')
    @UseGuards(AdminAuthGuard)
    async delete(@Param('key') key, @Param('id') id, @Body() body) {
        const r = await this.database.Selectors.findOne({ key, _id: id });
        if (!r) {
            throw new NotFoundException();
        }
        await this.database.Selectors.deleteOne({ _id: r._id });
        return await this.database.Selectors.findOne({ _id: r._id });
    }
}
