import { Request } from './request';
import { Mode } from '@ionic/core';
import { Enum } from "@suite/services";
export namespace FiltersModel{
    export interface Default extends Enum {
      id:number;
      reference?:number;
      name:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }
    export interface Reference extends Enum {
      id:number;
      reference:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface InternalGroup extends Enum {
      id:number;
      reference:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface Season extends Enum {
      id:number;
      reference:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface Enabled extends Enum {
      id:number;
      reference:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface Model extends Enum {
      id:number;
      reference:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface Product extends Enum {
      id:number;
      reference:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface User extends Enum {
      id:number;
      name:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface Color extends Enum {
      id:number;
      name:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface Size extends Enum {
      id:number;
      reference:number;
      name:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface Warehouse extends Enum {
      id:number;
      reference:string;
      name:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface Container extends Enum {
      id:number;
      reference:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface Brand extends Enum {
      id:number;
      name:string;
      reference:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface Supplier extends Enum {
      id:number;
      name:string;
      reference:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface Group extends Enum {
      id:number;
      reference:string;
      value:string;
      checked:boolean;
    }

    export interface Online extends Enum {
      id:number;
      name:string;
      reference:string;
      value:string;
      checked:boolean;
      hide:boolean;
    }

    export interface ResponseModel extends Request.Success{
      data:Array<Model>;
    }

    export interface ResponseProduct extends Request.Success{
      data:Array<Product>;
    }

    export interface ResponseUser extends Request.Success{
      data:Array<User>;
    }

    export interface ResponseBrand extends Request.Success{
      data:Array<Brand>
    }

    export interface ResponseColor extends Request.Success{
      data:Array<Color>;
    }

    export interface ResponseSize extends Request.Success{
      data:Array<Size>;
    }

    export interface ResponseWarehouse extends Request.Success{
      data:Array<Warehouse>
    }

    export interface ResponseContainer extends Request.Success{
      data:Array<Container>;
    }

    export interface ResponseGroup extends Request.Success{
      data:Array<Group>
    }
}
