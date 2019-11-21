import { PostalCodeModel } from '@suite/services';

export namespace ProvinceModel {
    export interface Province {
        id: number;
        name: string;
        country: number;
        postalCodes?: Array<PostalCodeModel.PostalCode>
    }
}