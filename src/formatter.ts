import * as moment from 'moment';
import { SEVERITIES } from '@src/constants';

export abstract class Formatter {
    public static toMacAddress = (mac, separator = ':') => {
        if (!mac) {
            return mac;
        }
        for (const s of [':', '-']) {
            if (mac.indexOf(s) > 0) {
                return mac
                    .split(s)
                    .map((p) => {
                        if (p.length < 2) {
                            p = `0${p}`;
                        }
                        return `${p}`.toUpperCase();
                    })
                    .join(separator);
            }
        }
        return `${mac}`.toUpperCase();
    };

    public static padZero = (number, size) => {
        let v = `${number}`;
        while (v.length < size) {
            v = '0' + v;
        }
        return v;
    };

    public static toDisplayShortDate = (date, empty = '') => {
        return date ? moment(date).format('MMM DD') : empty;
    };

    public static toDisplayDateTime = (date, empty = '') => {
        return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : empty;
    };

    public static toDisplayDate = (date, empty = '-') => {
        return date ? moment(date).format('YYYY-MM-DD') : empty;
    };

    public static toDisplayTime = (date, empty = '-') => {
        return date ? moment(date).format('HH:mm') : empty;
    };

    public static toDisplaySeverity = (severity) => {
        switch (severity) {
            case SEVERITIES.NOTICE:
                return 'Notice';
            case SEVERITIES.ERROR:
                return 'Error';
            case SEVERITIES.DEBUG:
                return 'Debug';
            case SEVERITIES.INFO:
                return 'Info';
            case SEVERITIES.ALERT:
                return 'Alert';
            case SEVERITIES.CRITICAL:
                return 'Critical';
            case SEVERITIES.EMERGENCY:
                return 'Emergency';
            case SEVERITIES.WARNING:
                return 'Warning';
            default:
                return severity;
        }
    };

    public static toDisplayNumber = (v, minimumFractionDigits = 2) => {
        return v !== null && v !== undefined ? v.toLocaleString(undefined, { minimumFractionDigits }) : '-';
    };

    public static toDisplayContact(contact: any) {
        return contact ? [contact.country_code, contact.number].filter((v) => !!`${v}`).join('') : '';
    }

    public static toDisplayFormatPrice(value: any, empty = '') {
        return !!value || value === 0 ? value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : empty;
    }
}
