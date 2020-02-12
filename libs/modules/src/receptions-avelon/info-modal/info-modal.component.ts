import {Component, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {ReceptionAvelonModel} from "@suite/services";
import Expedition = ReceptionAvelonModel.Expedition;
import {DateTimeParserService} from "../../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'suite-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit {

  expedition: Expedition;

  constructor(
    private modalController: ModalController,
    private dateTimeParserService: DateTimeParserService
  ){}

  ngOnInit() {
    this.expedition = {
      reference: "123456789",
      provider_name: "Calzados Lucatoni, S.L.U",
      provider_id: 3,
      total_packing: 2,
      delivery_date: "2019-09-06T14:07:55.513",
      shipper: "dhl",
      states_list: [2],
      reception_enabled: true
    };
    console.log('expedition:', this.expedition);
  }


  async close() {
    await this.modalController.dismiss();
  }

}
