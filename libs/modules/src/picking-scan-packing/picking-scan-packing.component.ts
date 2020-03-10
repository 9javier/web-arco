import {Component, OnInit} from '@angular/core';
import {PickingProvider} from "../../../services/src/providers/picking/picking.provider";
import {PickingScanditService} from "../../../services/src/lib/scandit/picking/picking.service";

@Component({
  selector: 'app-picking-scan-packing',
  templateUrl: './picking-scan-packing.component.html',
  styleUrls: ['./picking-scan-packing.component.scss']
})
export class PickingScanPackingComponent implements OnInit {

  message: string;

  constructor(
    private pickingProvider: PickingProvider,
    private pickingScanditService: PickingScanditService
  ) {}

  async ngOnInit() {
    if(this.pickingProvider.listProductsProcessedToStorePickings && this.pickingProvider.listProductsProcessedToStorePickings.length > 0){
      await this.pickingScanditService.picking(true);
    }else{
      this.message = 'No hay ningún producto procesado para asociar a un embalaje.';
    }
  }

}
