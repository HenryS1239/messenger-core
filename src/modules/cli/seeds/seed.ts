import { PLATFORM, USER_ROLE_TYPES, USER_TYPES } from '@src/constants';

export const USERS = [
    {
        type: USER_TYPES.ADMIN,
        username: 'admin',
        email: 'admin@mail.com',
        password: 'admin123',
        name: 'Default Admin',
        role: USER_ROLE_TYPES.ADMIN,
        platform: PLATFORM.PORTAL,
    },
];

export const ROLES = [
    {
        name: 'admin',
        type: USER_TYPES.ADMIN,
        canDelete: false,
    },
    {
        name: 'customer',
        type: USER_TYPES.CUSTOMER,
        canDelete: true,
    },
];
