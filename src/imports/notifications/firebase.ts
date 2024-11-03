import { Logger } from '@nestjs/common';
import { DIR_ROOT } from '@src/config';
import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import * as path from 'path';

const certPath = path.join(DIR_ROOT, './firebase.json');

type AppNotificationEvent = {
    event: any;
    customer: any;
};

export class Firebase {
    private static _instance = null;
    private readonly logger = new Logger(Firebase.name);
    private firebaseApp;
    private constructor() {
        const app = initializeApp({
            credential: credential.cert(certPath),
        });
        this.firebaseApp = app;
    }
    public static instance(): Firebase {
        if (!this._instance) {
            this._instance = new Firebase();
        }
        return this._instance;
    }

    async send({ customer, event }: AppNotificationEvent) {
        try {
            const data: any = {
                title: event.title,
                body: event.message,
            };
            const token = customer.registrationTokens;
            const message = {
                data,
                token,
            };
            getMessaging().send(message);
        } catch (e) {
            this.logger.debug(e);
            console.log(e);
            console.log('something went wrong');
            return e;
        }
    }
}
