import { Request } from './request';
export namespace GlobalVariableModel{

    export interface GlobalVariable{
        id?:number;
        type:number;
        value:string;
    }

    export interface Response extends Request.Success{
        data:GlobalVariable[]
    }

    export interface SingleResponse extends Request.Success{
        data:GlobalVariable
    }

    export interface Request{

    }
}