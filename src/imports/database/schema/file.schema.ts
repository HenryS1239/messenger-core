import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { API_URI } from '@src/config';

const schema = new mongoose.Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
        },
        path: {
            type: Schema.Types.String,
            default: null,
        },
        type: {
            type: Schema.Types.String,
            default: null,
        },
        size: {
            type: Schema.Types.Number,
            default: null,
        },
        url: {
            type: Schema.Types.String,
            default: null,
        },
        createdBy: {
            userId: { type: Schema.Types.String },
            name: { type: Schema.Types.String },
            type: { type: Schema.Types.String },
        },
        updatedBy: {
            userId: { type: Schema.Types.String },
            name: { type: Schema.Types.String },
            type: { type: Schema.Types.String },
        },
        deletedBy: {
            userId: { type: Schema.Types.String },
            name: { type: Schema.Types.String },
            type: { type: Schema.Types.String },
        },
        deletedAt: {
            type: Schema.Types.Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

schema.method({
    toJSON() {
        const obj = this.toObject();
        if (!obj['url']) {
            if (obj['type'].includes('image')) {
                obj['url'] = `${API_URI}/api/files/${obj['_id']}/file`;
            } else {
                obj['url'] = `${API_URI}/api/files/${obj['_id']}/download`;
            }
        }
        return obj;
    },
});

export const FileSchema = schema;

export interface IFile {
    _id: string;
    name: string;
    path: string;
    type: string;
    size: number;
    url: string;
    createdBy: any;
    updatedBy: any;
    deletedBy: any;
    deletedAt: Date;
}
