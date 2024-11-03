import * as moment from 'moment-timezone';
import { TIMEZONE } from './config';

export const groupBy = (array, key) => {
    return array.reduce((r, a) => {
        r[a[key]] = [...(r[a[key]] || []), a];
        return r;
    }, {});
};

export const random = {
    key: (length: number) => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#&^*&$';
        return random.string(length, chars);
    },
    alhanumeric: (length: number) => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return random.string(length, chars);
    },
    string: (length: number, chars: string) => {
        let result = '';
        for (let i = length; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    },
};

export const toDisplayTimeZoneDateTime = (date, empty = '') => {
    return date ? moment(date).tz(TIMEZONE).format('DD-MM-YYYY HH:mm:ss') : empty;
};

export const convertToNegativeNumber = (number: number) => {
    const isPositive = Math.sign(number) === 1;
    return isPositive ? number * -1 : number;
};

export const convertToFinancialString = (number: number) => {
    return number
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const roundTwoDecimals = (number: number) => {
    return Math.round((number + Number.EPSILON) * 100) / 100;
};
