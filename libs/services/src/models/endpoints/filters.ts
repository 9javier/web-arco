import { Request } from './request';
import { Mode } from '@ionic/core';
export namespace FiltersModel{
    
    export interface Color{
        id:number;
        name:string;
    }

    export interface Warehouse{
        id:number;
        reference:string;
    }

    export interface Group{
        id:number;
        reference:string;
    }

    export interface Container{
        id:number;
        reference:string;
    }

    export interface Model{
        id:number;
        reference:string;
    }

    export interface Size{
        id:number;
        reference:number;
        name:string;
    }

    export interface ResponseColor extends Request.Success{
        data:Array<Color>;
    }

    export interface ResponseWarehouse extends Request.Success{
        data:Array<Warehouse>
    }

    export interface ResponseGroup extends Request.Success{
        data:Array<Group>
    }

    export interface ResponseContainer extends Request.Success{
        data:Array<Container>;
    }

    export interface ResponseModel extends Request.Success{
        data:Array<Model>;
    }

    export interface ResponseSize extends Request.Success{
        data:Array<Size>;
    }
}