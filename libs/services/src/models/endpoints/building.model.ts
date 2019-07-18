import { Request } from './request';

export namespace BuildingModel{
    /**
     * Model for building objects
     */
    export interface Building{
        id:number;
        name:string;
        createAt:string;
        updateAt:string;
    }

    /**
     * Model for the return of get index building objects
     */
    export interface ListResponse extends Request.Success{
        data:Array<Building>
    }

    export interface SingleResponse extends Request.Success{
        data:Building
    }


    /**
     * Model of data to be sended to backend for store or update method
     */
    export interface SingleRequest{
        name:string;
    }

}

