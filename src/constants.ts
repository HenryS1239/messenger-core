export const SETTING_KEYS = {
    SYSTEM: {
        AUTH: {
            METHOD: 'system.auth.method',
        },
        COMPANY: {
            NAME: 'system.company.name',
        },
    },
    NOTIFICATION: {
        EMAIL: {
            SENDER: 'notification.email.sender',
            TYPE: 'notification.email.type',
            HOST: 'notification.email.host',
            PORT: 'notification.email.port',
            SSL: 'notification.email.ssl',
            USER: 'notification.email.user',
            PASS: 'notification.email.pass',
            SENDER_NAME: 'notification.email.sender.name',
            SENDER_EMAIL: 'notification.email.sender.email',
            API_KEY: 'notification.email.mailgun.api_key',
            DOMAIN: 'notification.email.mailgun.domain',
        },
    },
    AUTH: {
        CONTACT: {
            WHITELIST: 'auth.contact.whitelist',
        },
    },
    TERMS_OF_USE: 'terms_of_use',
    PRIVACY_POLICY: 'privacy_policy',
    REFUND_POLICY: 'refund_policy',
    FAQ: 'faq',
};

export const PLATFORM = {
    APP: 'app',
    WEB: 'web',
    PORTAL: 'portal',
};

export const SELECTOR_KEYS = {
    COUNTRY: {
        NAME: 'country.name',
        STATE: 'country.state',
        PHONE_CODES: 'country.phone_codes',
    },
};

export const USER_TYPES = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
};

export const USER_ROLE_TYPES = {
    ...USER_TYPES,
};

//__________________

export const SEVERITIES = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    NOTICE: 'NOTICE',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
    CRITICAL: 'CRITICAL',
    ALERT: 'ALERT',
    EMERGENCY: 'EMERGENCY',
};

export const AUTH_METHODS = {
    LOCAL: 'local',
};

export const LOG_TYPES = {
    AUDIT: 'audit',
    SYSTEM: 'system',
};

//____

export const IGNORE_FIELD = '-__v -createdBy -updatedBy -deletedBy -createdAt -updatedAt -deletedAt -password';

export const GENERAL_STATUS_LIST = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAIL: 'FAIL',
};
