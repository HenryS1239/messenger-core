import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@src/imports/database';

import { USERS, ROLES } from './seeds/seed';
import { SettingService } from '@src/imports/util';

@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

    constructor(private readonly database: DatabaseService, private readonly setting: SettingService) {}

    public async data() {
        for (const r of ROLES) {
            let role = await this.database.Role.findOne({ name: r.name });
            if (!role) {
                role = await this.database.Role.create({
                    name: r.name,
                    type: r.type,
                });
                this.logger.log(`created ${r.name} role`);
            }
        }
        for (const user of USERS) {
            const { type, username, password, name, email, role } = user;
            const userRole = await this.database.Role.findOne({ name: role });

            if ((await this.database.User.countDocuments({ email })) === 0) {
                const r = new this.database.User();
                r.username = username;
                r.password = password;
                r.email = email;
                r.name = name;
                r.type = type;
                r.role = userRole._id;
                await r.save();
                this.logger.log(`created User - ${r.username}`);
            }
        }
    }
}
