import { Logger } from '@nestjs/common';
import { DIR_ROOT } from '@src/config';
import * as admin from 'firebase-admin';
import * as path from 'path';

type AppNotificationEvent = {
    event: any;
    customer: any;
    target?: string;
    targetId?: string;
};

export class Firebase {
    private static _instance = null;
    private readonly logger = new Logger(Firebase.name);
    private firebaseAuth: admin.auth.Auth;
    private firebaseMessage: admin.messaging.Messaging;

    private constructor() {
        const app = admin.initializeApp(
            {
                credential: admin.credential.cert(require(path.join(DIR_ROOT, './firebase.json'))),
            },
            'app',
        );
        this.firebaseAuth = app.auth();
        this.firebaseMessage = app.messaging();
    }
    public static instance(): Firebase {
        if (!this._instance) {
            this._instance = new Firebase();
        }
        return this._instance;
    }

    async send({ event, customer, target, targetId }: AppNotificationEvent) {
        try {
            const notification = {
                title: event.title,
                body: event.message,
            };
            const data: any = {};
            const tokens = [customer.registrationTokens];
            const message: admin.messaging.MulticastMessage = {
                notification,
                tokens,
                // android: {
                //     notification: {
                //         sound: 'meow.mp3',
                //         channelId: 'meow_notification',
                //     },
                // },
                // apns: {
                //     payload: {
                //         aps: {
                //             alert: notification,
                //             // sound: 'meow.aiff',
                //         },
                //     },
                // },
            };
            if (target) {
                data.target = target;
            }
            if (targetId) {
                data.targetId = targetId.toString();
            }
            if (target && targetId) {
                message.data = data;
            }

            const responses: admin.messaging.BatchResponse = await this.firebaseMessage.sendMulticast(message);
            if (responses.failureCount > 0) {
                for (const index in responses.responses) {
                    const response = responses.responses[index];
                    const error = response.error;
                    if (error) {
                        if (
                            error.code === 'messaging/invalid-registration-token' ||
                            error.code === 'messaging/registration-token-not-registered'
                        ) {
                        }
                    }
                }
            } else {
                this.logger.log('Send notification fail.');
            }
        } catch (e) {
            console.log(e);
            console.log('something went wrong');
            return e;
        }
    }
}
