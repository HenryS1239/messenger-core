import { Schema } from 'mongoose';

export const SelectorsSchema = new Schema(
    {
        key: { type: Schema.Types.String, required: true },
        value: { type: Schema.Types.String, default: null },
        order: { type: Schema.Types.Number, default: 0 },
    },
    {
        timestamps: true,
        toJSON: { versionKey: false },
    },
);

export interface ISelector extends Document {
    key: string;
    value: string;
    order: number;
}
