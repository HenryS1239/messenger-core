import { Body, Controller, Delete, Get, NotAcceptableException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminAuthGuard, UserAppAuthGuard } from '@src/imports/auth';
import { SettingService } from '@src/imports/util';
import { SETTING_KEYS } from '@src/constants';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Customer:Settings')
@ApiBearerAuth()
@Controller('/api/customer/settings')
export class SettingsController {
    constructor(private readonly settings: SettingService) {}

    @Get('general')
    async getGeneral() {
        const settings = await this.settings.gets([SETTING_KEYS.SYSTEM.COMPANY.NAME]);
        return {
            ...settings,
        };
    }

    @ApiQuery({ name: 'keys', description: 'split with comma' })
    @Get('')
    @UseGuards(UserAppAuthGuard)
    async get(@Query() { keys }) {
        if (!keys) {
            throw new NotAcceptableException(`key is required`);
        }
        return await this.settings.gets(keys.split(','));
    }

    @ApiParam({ name: 'key' })
    @Get(':key')
    @UseGuards(UserAppAuthGuard)
    async getSingle(@Param('key') key) {
        const result = await this.settings.get(key);
        return {
            [key]: result,
        };
    }
}
