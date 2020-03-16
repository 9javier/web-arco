import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";
import {ReceptionAvelonProvider} from "../../../services/src/providers/reception-avelon/reception-avelon.provider";
import {ReceptionAvelonModel} from "@suite/services";
import Expedition = ReceptionAvelonModel.Expedition;
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {StatesExpeditionAvelonProvider} from "../../../services/src/providers/states-expetion-avelon/states-expedition-avelon.provider";

@Component({
  selector: 'suite-receptions-avelon-app',
  templateUrl: './receptions-avelon-app.component.html',
  styleUrls: ['./receptions-avelon-app.component.scss']
})
export class ReceptionsAvelonAppComponent implements OnInit, OnDestroy {

  expedition: Expedition;

  constructor(
    private router: Router,
    private toolbarProvider: ToolbarProvider,
    private receptionAvelonProvider: ReceptionAvelonProvider,
    public dateTimeParserService: DateTimeParserService,
    private stateExpeditionAvelonProvider: StatesExpeditionAvelonProvider
  ) {}

  ngOnInit() {
    this.expedition = this.receptionAvelonProvider.expedition;
    this.toolbarProvider.currentPage.next('#'+this.expedition.reference);
  }

  ngOnDestroy() {
    this.receptionAvelonProvider.expeditionData = null;
  }

  receptionBySearch() {
    this.router.navigate(['receptions-avelon', 'app', 'manual']);
  }

  stringStates(states: number[]){
    return this.stateExpeditionAvelonProvider.getStringStates(states);
  }

}
