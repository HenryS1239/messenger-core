import { Schema } from 'mongoose';

export const AddressField = {
    COMMON: {
        address1: {
            type: Schema.Types.String,
            default: null,
        },
        address2: {
            type: Schema.Types.String,
            default: null,
        },
        address3: {
            type: Schema.Types.String,
            default: null,
        },
        city: {
            type: Schema.Types.String,
            default: null,
        },
        postcode: {
            type: Schema.Types.String,
            default: null,
        },
        state: {
            type: Schema.Types.String,
            default: null,
        },
        country: {
            type: Schema.Types.String,
            default: null,
        },
    },
    GEO: {
        geo: {
            type: {
                type: Schema.Types.String,
                default: 'Point',
            },
            coordinates: [
                {
                    type: Schema.Types.Number,
                    default: 0,
                },
            ],
        },
    },
};
export const AddressTemplate = {
    STANDARD_ADDRESS: {
        ...AddressField.COMMON,
        ...AddressField.GEO,
    },
    ADDRESS_NO_GEO: {
        ...AddressField.COMMON,
    },
};

export interface IGeo {
    type: string;
    coordinates: number[];
}

export interface IStandardAddress {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    postcode: string;
    state: string;
    country: string;
    geo: IGeo;
}
