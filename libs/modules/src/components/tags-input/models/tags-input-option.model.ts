import {Enum} from "@suite/services";

export class TagsInputOption {
    id:number|string;
    name:string;
    hide?:boolean;
    reference?:string|number;
    type?:string;
    value?:string;
    checked?:boolean;
}
