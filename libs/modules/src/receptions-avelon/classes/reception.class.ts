import { ReceptionAvelonModel } from '@suite/services';
export class Reception implements ReceptionAvelonModel.Reception {
    brands: Array<ReceptionAvelonModel.Data>;
    models: Array<ReceptionAvelonModel.Data>;
    colors: Array<ReceptionAvelonModel.Data>;
    sizes: Array<ReceptionAvelonModel.Data>;
    ean: string;
    
    constructor() {
        this.brands = [];
        this.models = [];
        this.colors = [];
        this.sizes = [];
        this.ean = '';
    }
}