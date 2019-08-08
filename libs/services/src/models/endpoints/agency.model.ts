import { Request } from './request';

export namespace AgencyModel{

    export interface Agency{
        id:number;
        name:string;
        address:string;
        phone:number;
        
    }

    export interface Response extends Request.Success{
        data:Array<Agency>;
    }

    export interface SingleResponse extends Request.Success{
        data:Agency;
    }

    export interface Request extends Request.Success{
        name:string;
        address:string;
        phone:string;
    }

}