import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@src/imports/database';
import { INotification } from '@src/imports/database/schema';
import { Firebase } from '@src/imports/notifications/firebase';
import { PLATFORM } from '@src/constants';

type AppEvent = {
    app({ event, user, data }): Promise<any> | any;
    web({ event, user, data }): Promise<any> | any;
};
type GetEvent = {
    list(search: NotificationSearch): Promise<any>;
    browserAlert(body: NotificationAlert): Promise<any>;
    appAlert(body: NotificationAlert): Promise<any>;
};

type NotificationInput = {
    target: string;
    targetId: string;

    appNotifiedAt: Date;
    appReadAt?: Date;
    webReadAt?: Date;

    message: string;
    title: string;

    user?: string;
    company?: string;

    isBrowserRequest?: boolean;
};

type NotificationInputDelete = {
    id: string;
    user: any;
};

type NotificationSearch = {
    limit: string;
    offset: string;
    sort?: string;
    search?: string;
    user: any;
};

type NotificationAlert = {
    user: any;
    source?: string;
};

type NotificationRead = {
    ids: string;
    source: string;
    user: any;
};

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(private readonly database: DatabaseService) {}

    public get send(): AppEvent {
        return {
            web: async ({ event, user, data }) => {
                const details = event;

                //== STORE PUSH MESSAGE TO DB
                await this.add({
                    appNotifiedAt: new Date(),
                    user,
                    isBrowserRequest: true,
                    ...details,
                });
            },
            app: async ({ event, user, data }) => {
                const details = event;

                //== SEND PUSH NOTIFICATION
                if (user.isNotification && user.registrationTokens) {
                    await Firebase.instance().send({
                        customer: user,
                        event: {
                            title: details.title,
                            message: details.message,
                        },
                        target: details.target,
                        targetId: details.targetId,
                    });
                }
                //== STORE PUSH MESSAGE TO DB
                await this.add({
                    appNotifiedAt: new Date(),
                    user,
                    ...details,
                });
            },
        };
    }

    public async add(body: NotificationInput): Promise<INotification> {
        const data = new this.database.Notification(body);
        return await data.save();
    }
    public async remove({ id, user }: NotificationInputDelete): Promise<boolean> {
        const data = await this.database.Notification.findById(id);
        data.deletedAt = new Date();
        data.deletedBy = {
            userId: user._id,
            name: user.name,
            type: user.type,
        };
        await data.save();

        return true;
    }

    public get get(): GetEvent {
        return {
            list: async (query: NotificationSearch) => {
                const { sort, offset, limit, user } = query;

                const conditions: any = { deletedAt: { $eq: null }, user: user._id };

                const total = await this.database.Notification.countDocuments(conditions);
                const items = await this.database.Notification.find(conditions)
                    .select('-appNotifiedAt -appReadAt -webReadAt -customer -company -updatedAt -appReadBy -webReadBy')
                    .sort(sort || '-createdAt')
                    .skip(parseInt(offset) || 0)
                    .limit(parseInt(limit) || 10);

                return {
                    total,
                    items,
                };
            },
            browserAlert: async ({ user, source }: NotificationAlert) => {
                const conditions: any = { deletedAt: { $eq: null }, type: user.type };

                if (source === PLATFORM.WEB) {
                    conditions.isBrowserRequest = true;
                }

                const total = await this.database.Notification.countDocuments(conditions);
                const notis = await this.database.Notification.find(conditions);

                //== off showed alert
                await this.database.Notification.updateMany(
                    { _id: { $in: notis.map((n) => n._id) } },
                    { $set: { isBrowserRequest: false } },
                );

                //== decide message to show
                let title = null;
                let message = null;

                if (total > 0 && total < 2) {
                    title = notis[0].title;
                    message = notis[0].message;
                }
                if (total > 1) {
                    message = `You have ${total} new notifications.`;
                }

                return {
                    count: total,
                    title,
                    message,
                };
            },
            appAlert: async ({ user }: NotificationAlert) => {
                const conditions: any = { deletedAt: { $eq: null }, customer: user._id, isRead: false };
                const total = await this.database.Notification.countDocuments(conditions);
                return {
                    count: total,
                };
            },
        };
    }

    public async read({ ids, source, user }: NotificationRead): Promise<boolean> {
        const notification: any = await this.database.Notification.find({ _id: { $in: ids } });
        if (!notification) {
            throw new NotFoundException('Notification not found.');
        }
        const by = {
            userId: user._id,
            name: user.name,
            type: user.type,
        };

        let set = null;
        switch (source.toLowerCase()) {
            case PLATFORM.APP:
                set = { appReadAt: new Date(), appReadBy: by };
                break;
            case PLATFORM.WEB:
                set = { webReadAt: new Date(), webReadBy: by };
                break;
        }

        await this.database.Notification.updateMany({ _id: { $in: ids } }, { $set: { ...set, isRead: true } });

        return true;
    }
}
