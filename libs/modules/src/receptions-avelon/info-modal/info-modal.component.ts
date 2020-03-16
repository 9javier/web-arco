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

  title: string = 'Información de la expedición';
  titleAnotherExpeditions: string = 'Otras expediciones';
  expedition: Expedition = null;
  anotherExpeditions: Expedition[] = [];

  constructor(
    private modalController: ModalController,
    private dateTimeParserService: DateTimeParserService
  ){}

  ngOnInit() {}

  stringStates(states: number[]){
    const stringStates: string[] = [];
    for(let state of states){
      if(state == 1){
        stringStates.push('Bloqueado');
      }else{
        stringStates.push('Desconocido');
      }
    }
    return stringStates.join(', ');
  }

  async close() {
    await this.modalController.dismiss();
  }

  async reception(expedition: Expedition) {
    await this.modalController.dismiss({reception: true, expedition});
  }
}
