import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const BannedTokenSchema = new mongoose.Schema(
    {
        token: { type: Schema.Types.String, required: true },
    },
    {
        timestamps: true,
    },
);
