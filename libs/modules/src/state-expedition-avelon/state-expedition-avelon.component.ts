import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {animate, state, style, transition, trigger} from '@angular/animations';
import { StateExpeditionAvelonService } from 'libs/services/src/lib/endpoint/state-expedition-avelon/state-expedition-avelon.service';
import { IntermediaryService } from "../../../services/src/lib/endpoint/intermediary/intermediary.service";

@Component({
  selector: 'app-state-expedition-avelon',
  templateUrl: './state-expedition-avelon.component.html',
  styleUrls: ['./state-expedition-avelon.component.scss'],
  animations:  [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class StateExpeditionAvelonComponent implements OnInit {

  stateExpeditionAvelons: any;
  displayedColumns = ['name', 'status'];

  constructor(
    private modalCtrl: ModalController,
    private stateExpeditionAvelonService: StateExpeditionAvelonService,
    private intermediaryService: IntermediaryService
  ) {}
  
  ngOnInit() {
    this.getStateExpeditionsAvalon();
  }

  getStateExpeditionsAvalon() {
      this.intermediaryService.presentLoading();
      this.stateExpeditionAvelonService.getIndex().subscribe(response=>{
        this.intermediaryService.dismissLoading();  
        this.stateExpeditionAvelons = response;
      })
  }

  public upperCamelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toUpperCase() : word.toLowerCase();
    }).replace(/\s+/g, '');
  }

  public changeValue(element) {
    this.stateExpeditionAvelonService.update(element.id, element).subscribe(()=>{
      this.intermediaryService.presentToastSuccess("Actualizado el bloqueo/desbloqueo del estado.");
    },()=>{
      this.intermediaryService.presentToastError("Ha ocurrido un error al intentar bloquear/desbloquear el estado.");
    })
  }
}



