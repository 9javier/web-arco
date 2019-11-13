import { ProvinceModel } from '@suite/services';

export namespace CountryModel {
    export interface Country {
        id?: number;
        name:string;
        provinces?:Array<ProvinceModel.Province>
    }
}