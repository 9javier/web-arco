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

  noPendingReceptions: boolean = true;
  noPendingConfirms: boolean = true;
  receptionDisabled: boolean = false;
  expeditionBlocked: boolean = false;

  constructor(
    private modalController: ModalController,
    private dateTimeParserService: DateTimeParserService
  ){}

  ngOnInit() {
    //Blocked?
    if(this.expedition){
      if(this.expedition.expeditionStates.includes(1)){
        this.expeditionBlocked = true;
      }
    }else{
      if(this.anotherExpeditions[0].expeditionStates.includes(1)){
        this.expeditionBlocked = true;
      }
    }


    //Pending confirms?
    if(this.expedition && this.expedition.states_list.includes(1)){
      this.noPendingConfirms = false;
    }else{
      for(let expedition of this.anotherExpeditions){
        if(expedition.states_list.includes(1)){
          this.noPendingConfirms = false;
          break;
        }
      }
    }

    //Pending receptions?
    if(this.expedition && this.expedition.states_list.includes(2)){
      this.noPendingReceptions = false;
    }else{
      for(let expedition of this.anotherExpeditions){
        if(expedition.states_list.includes(2)){
          this.noPendingReceptions = false;
          break;
        }
      }
    }

    //Reception enabled?
    if(this.expedition){
      if(this.expedition.expeditionStates.length == 0 || this.expeditionBlocked || this.noPendingReceptions){
        this.receptionDisabled = true;
      }
    }else{
      if(this.anotherExpeditions[0].expeditionStates.length == 0 || this.expeditionBlocked || this.noPendingReceptions){
        this.receptionDisabled = true;
      }
    }
  }

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
