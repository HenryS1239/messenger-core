import { Body, Controller, Delete, Get, NotAcceptableException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '@src/imports/auth';
import { SettingService } from '@src/imports/util';
import { SETTING_KEYS } from '@src/constants';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateSettingsDTO } from './dto/settings.dto';

@ApiTags('Core:Settings')
@ApiBearerAuth()
@Controller('/api/core/settings')
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
    @UseGuards(AdminAuthGuard)
    async get(@Query() { keys }) {
        if (!keys) {
            throw new NotAcceptableException(`key is required`);
        }
        return await this.settings.gets(keys.split(','));
    }

    @Put('')
    @UseGuards(AdminAuthGuard)
    async set(@Body() settings: UpdateSettingsDTO) {
        if (!settings) {
            throw new NotAcceptableException(`settings is required`);
        }
        if (settings.keys) {
            for (const key of Object.keys(settings.keys)) {
                await this.settings.set(key, settings.keys[key]);
            }
        } else {
            await this.settings.set(settings.key, settings.value);
        }
        return { success: true };
    }

    @ApiParam({ name: 'key' })
    @Get(':key')
    @UseGuards(AdminAuthGuard)
    async getSingle(@Param('key') key) {
        const result = await this.settings.get(key);
        return {
            [key]: result,
        };
    }

    @ApiParam({ name: 'key' })
    @Delete(':key')
    @UseGuards(AdminAuthGuard)
    async delete(@Param('key') key) {
        return await this.settings.delete(key);
    }
}
