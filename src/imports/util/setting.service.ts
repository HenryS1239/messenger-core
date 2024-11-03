import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@src/imports/database';

@Injectable()
export class SettingService {
    constructor(private readonly database: DatabaseService) {}

    async has(key: string) {
        return (
            (await this.database.Setting.findOne({ key })?.countDocuments()) ===
            1
        );
    }

    async set(key: string, value: any) {
        let rs = await this.database.Setting.findOne({ key });
        if (!rs) {
            rs = new this.database.Setting({
                key,
                value,
                valueType: typeof value,
            });
        } else {
            rs.value = value;
            rs.valueType = typeof value;
        }
        await rs.save();
        return true;
    }

    async get(key: string, fallback?: any) {
        const rs = await this.database.Setting.findOne({ key });
        return rs ? rs.value : fallback;
    }

    async delete(key: string) {
        const rs = await this.database.Setting.findOne({ key });
        if (rs) {
            await rs.delete();
            return rs;
        }
        return false;
    }

    async gets(keys: string[]) {
        const rs = await this.database.Setting.find({
            key: { $in: keys },
        });
        const data = {};
        for (const key of keys) {
            const f = rs.find((s) => s.key === key);
            data[key] = f ? f.value : null;
        }
        return data;
    }
}
