import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { SEVERITIES, LOG_TYPES } from '@src/constants';

const schema = new mongoose.Schema(
    {
        type: { type: Schema.Types.String, required: true },
        severity: { type: Schema.Types.String, enum: Object.values(SEVERITIES) },
        timestamp: Schema.Types.Date,
        message: Schema.Types.String,
        _metadata: { type: Schema.Types.Mixed, select: false },
    },
    {
        timestamps: true,
        toJSON: { versionKey: false },
    },
);

export const LogSchema = schema;
