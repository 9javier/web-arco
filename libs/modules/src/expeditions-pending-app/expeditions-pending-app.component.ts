import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormExpeditionInfoComponent} from "./components/form-expedition-info/form-expedition-info.component";
import {ExpeditionInfoComponent} from "./components/expedition-info/expedition-info.component";
import {ReceptionsAvelonService} from "../../../services/src/lib/endpoint/receptions-avelon/receptions-avelon.service";
import {IntermediaryService} from "../../../services/src/lib/endpoint/intermediary/intermediary.service";
import {ReceptionAvelonModel} from "../../../services/src/models/endpoints/receptions-avelon.model";
import {AnotherExpeditionsComponent} from "./components/another-expeditions/another-expeditions.component";
import {ReceptionAvelonProvider} from "../../../services/src/providers/reception-avelon/reception-avelon.provider";

@Component({
  selector: 'suite-expeditions-pending-app',
  templateUrl: './expeditions-pending-app.component.html',
  styleUrls: ['./expeditions-pending-app.component.scss']
})
export class ExpeditionsPendingAppComponent implements OnInit {

  @ViewChild(FormExpeditionInfoComponent) formExpeditionInfo: FormExpeditionInfoComponent;
  @ViewChild(ExpeditionInfoComponent) expeditionInfo: ExpeditionInfoComponent;
  @ViewChild(AnotherExpeditionsComponent) anotherExpeditions: AnotherExpeditionsComponent;

  private lastExepeditionQueried = {reference: null, providerId: null};

  constructor(
    private router: Router,
    private receptionsAvelonService: ReceptionsAvelonService,
    private intermediaryService: IntermediaryService,
    private receptionAvelonProvider: ReceptionAvelonProvider
  ) {}

  ngOnInit() {
  }

  public checkExpedition(data) {
    this.formExpeditionInfo.checkingExpeditionInProcess = true;
    this.lastExepeditionQueried = {
      reference: data.number_expedition,
      providerId: data.provider_expedition.id
    };

    this.receptionsAvelonService
      .checkExpeditionsByNumberAndProvider({
        expeditionNumber: data.number_expedition,
        providerId: data.provider_expedition.id
      })
      .subscribe((res: ReceptionAvelonModel.ResponseCheckExpeditionsByNumberAndProvider) => {
        if (res.code == 200) {
          const expeditionInfo = res.data.expedition || null;
          const anotherExpeditions = res.data.another_expeditions || [];

          this.expeditionInfo.loadNewExpeditionInfo(data.number_expedition, data.provider_expedition.name, expeditionInfo);
          this.anotherExpeditions.loadNewAnotherExpeditionsInfo(anotherExpeditions);

          this.formExpeditionInfo.checkingExpeditionInProcess = false;
          this.formExpeditionInfo.initForm();
          this.formExpeditionInfo.focusInExpeditionNumberInput();
          this.formExpeditionInfo.resetAutocompleteList();
        } else {
          this.formExpeditionInfo.checkingExpeditionInProcess = false;
          this.intermediaryService.presentToastError('Ha ocurrido un error al intentar comprobar si había alguna expedición pendiente para el proveedor.', 'bottom');
        }
      }, (error) => {
        this.formExpeditionInfo.checkingExpeditionInProcess = false;
        this.intermediaryService.presentToastError('Ha ocurrido un error al intentar comprobar si había alguna expedición pendiente para el proveedor.', 'bottom');
      });
  }

  public receptionExpedition(data) {
    this.receptionAvelonProvider.expeditionData = this.lastExepeditionQueried;
    this.router.navigate(['receptions-avelon', 'app']);
  }
}
