import {Component, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {ReceptionAvelonModel} from "@suite/services";
import Expedition = ReceptionAvelonModel.Expedition;
import {
  ModelService
} from '@suite/services';

@Component({
  selector: 'suite-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit {

  title: string = 'Detalle de tallas en modelo';
  modelId = null;
  dataSource: any;
  displayedColumns: string[] = ['size', 'ean', 'status'];

  constructor(
    private modalController: ModalController,
    private modelService: ModelService,
  ){}

  async ngOnInit() {

    await this.modelService.getSizePerModel(this.modelId).subscribe(values => {      
      this.title = 'Detalle de tallas en modelo ' + values.reference;
      this.dataSource = values.sizes;
    }, error=>{
      console.log("error", error)
    });

  }
  async close() {
    await this.modalController.dismiss();
  }
}
