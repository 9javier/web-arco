import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";
import {ReceptionAvelonProvider} from "../../../services/src/providers/reception-avelon/reception-avelon.provider";
import {ReceptionAvelonModel} from "@suite/services";
import Expedition = ReceptionAvelonModel.Expedition;
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {StatesExpeditionAvelonProvider} from "../../../services/src/providers/states-expetion-avelon/states-expedition-avelon.provider";
import {ScannerManualComponent} from "@suite/common-modules";

@Component({
  selector: 'suite-receptions-avelon-app',
  templateUrl: './receptions-avelon-app.component.html',
  styleUrls: ['./receptions-avelon-app.component.scss']
})
export class ReceptionsAvelonAppComponent implements OnInit, OnDestroy {

  @ViewChild(ScannerManualComponent) scannerManual: ScannerManualComponent;

  expedition: Expedition;
  deliveryNote: string = null;
  public isReceptionWithoutOrder: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toolbarProvider: ToolbarProvider,
    private receptionAvelonProvider: ReceptionAvelonProvider,
    public dateTimeParserService: DateTimeParserService,
    private stateExpeditionAvelonProvider: StatesExpeditionAvelonProvider
  ) {}

  ngOnInit() {
    this.expedition = this.receptionAvelonProvider.expedition;
    this.isReceptionWithoutOrder = !!(this.activatedRoute.snapshot && this.activatedRoute.snapshot.routeConfig && this.activatedRoute.snapshot.routeConfig.path && this.activatedRoute.snapshot.routeConfig.path == 'free');
    this.toolbarProvider.currentPage.next('#'+this.expedition.reference);
  }

  ngOnDestroy() {
    this.receptionAvelonProvider.expeditionData = null;
  }

  receptionBySearch() {
    const routeSections = ['receptions-avelon', 'app'];
    if (this.isReceptionWithoutOrder) {
      routeSections.push('free');
    }
    routeSections.push('manual');

    this.router.navigate(routeSections);
  }

  stringStates(states: number[]){
    return this.stateExpeditionAvelonProvider.getStringStates(states);
  }

  public newDeliveryNote(deliveryNote) {
    this.deliveryNote = deliveryNote;
    this.receptionAvelonProvider.deliveryNote = deliveryNote;
  }

  public removeDeliveryNote() {
    this.newDeliveryNote(null);
    this.scannerManual.setValue(null);
  }

}
