import {Component, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {ReceptionAvelonModel} from "@suite/services";
import Expedition = ReceptionAvelonModel.Expedition;
import {DateTimeParserService} from "../../../../services/src/lib/date-time-parser/date-time-parser.service";
import {StatesExpeditionAvelonProvider} from "../../../../services/src/providers/states-expetion-avelon/states-expedition-avelon.provider";

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
    private dateTimeParserService: DateTimeParserService,
    private stateExpeditionAvelonProvider: StatesExpeditionAvelonProvider
  ){}

  ngOnInit() {}

  stringStates(states: number[]){
    return this.stateExpeditionAvelonProvider.getStringStates(states);
  }

  async close() {
    await this.modalController.dismiss();
  }

  async reception(expedition: Expedition) {
    await this.modalController.dismiss({reception: true, expedition});
  }
}
