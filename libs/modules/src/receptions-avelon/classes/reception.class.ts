import { ReceptionAvelonModel } from '@suite/services';
export class Reception implements ReceptionAvelonModel.Reception {
    brands: Array<ReceptionAvelonModel.Data>;
    models: Array<ReceptionAvelonModel.Data>;
    colors: Array<ReceptionAvelonModel.Data>;
    sizes: Array<ReceptionAvelonModel.Data>;
    lines:{
      id: number,
      state: number,
      brandId: number,
      modelId: number,
      colorId: number
    }[];
    ean: string;
    
    constructor() {
        this.brands = [];
        this.models = [];
        this.colors = [];
        this.sizes = [];
        this.lines = [];
        this.ean = '';
    }
}
