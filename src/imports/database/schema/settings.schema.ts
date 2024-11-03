import { SETTING_KEYS } from '@src/constants';
import { Schema } from 'mongoose';

export const SettingSchema = new Schema(
    {
        key: {
            type: Schema.Types.String,
            required: true,
            enum: [SETTING_KEYS.TERMS_OF_USE, SETTING_KEYS.REFUND_POLICY, SETTING_KEYS.PRIVACY_POLICY, SETTING_KEYS.FAQ],
        },
        value: { type: Schema.Types.Mixed, default: null },
        valueType: { type: Schema.Types.String, defaul: null },
    },
    {
        timestamps: true,
    },
);
