import {WaySorterModel} from "./WaySorter";
import {ColorSorterModel} from "./ColorSorter";
import {WarehouseModel} from "@suite/services";

export namespace SorterModel {

    export interface Sorter {
        createdAt: string,
        updatedAt: string,
        id: number;
        name: string;
        ways: number;
        columns: number;
        heights: number;
        active: boolean;
        warehouseId?: number;
        zoneSorter?: any,
        waySorter?: Ways[],
        colors?: [],
    }

    export interface Ways {
        id: number;
        name: string;
        ways: number;
        column: number;
        height: number;
        active: boolean;
        sorter: number;
        color?: any;
        zoneSorter?: any,
        waySorter?: any 
    }

    export interface ResponseSorter{
        data:Array<Sorter>;
    }

    export interface ResponseSorterCreate{
        data:{
            sorter: Sorter;
            ways: Array<Ways>;
        }
    }
    export interface ResponseSorterUpdate{
        data:  Sorter;
    }

    export interface FirstSorter {
      createdAt: string,
      updatedAt: string,
      id: number,
      name: string,
      ways: number,
      columns: number,
      heights: number,
      active: boolean,
      zoneSorter: any[],
      waySorter: WaySorterModel.WaySorter[],
      colors: ColorSorterModel.ColorAssignedSorter[],
      warehouse: WarehouseModel.Warehouse
    }

    export interface ResponseFirstSorter {
      data: FirstSorter
    }
}
