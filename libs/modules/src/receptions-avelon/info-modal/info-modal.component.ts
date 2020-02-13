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
  anotherExpeditions: Expedition[];
  expeditionNumber: string;
  providerName: string;

  constructor(
    private modalController: ModalController,
    private dateTimeParserService: DateTimeParserService
  ){}

  ngOnInit() {
    this.providerName = this.expedition.provider_name;
    this.expeditionNumber = this.expedition.reference;
  }

  stringStates(expedition: Expedition){
    const stringStates: string[] = [];
    for(let state of expedition.states_list){
      if(state == 1){
        stringStates.push('Bloqueado');
      }else{
        stringStates.push('Desconocido');
      }
    }
    return stringStates.join(', ');
  }

  async close() {
    await this.modalController.dismiss({reception: false});
  }

  async reception() {
    await this.modalController.dismiss({reception: true});
  }

}
