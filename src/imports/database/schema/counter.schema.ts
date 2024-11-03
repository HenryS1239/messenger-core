import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
        },
        seq: {
            type: Number,
            default: 1000001,
        },
    },
    {
        timestamps: true,
    },
);

export const CounterSchema = schema;

export interface ICounter {
    id: string;
    seq: number;
}
