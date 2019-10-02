import { Request } from './request';
export namespace SorterModel{
    export interface Sorter{
        id: number;
        name: string;
        ways: number;
        columns: number;
        heights: number;
        active: boolean;
        warehouseId: number;
        zoneSorter?: any,
        waySorter?: Ways[],
        colors?: [],
    }
    export interface Ways{
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
}