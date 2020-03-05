import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormExpeditionInfoComponent} from "./components/form-expedition-info/form-expedition-info.component";
import {ReceptionsAvelonService} from "../../../services/src/lib/endpoint/receptions-avelon/receptions-avelon.service";
import {IntermediaryService} from "../../../services/src/lib/endpoint/intermediary/intermediary.service";
import {ReceptionAvelonModel} from "../../../services/src/models/endpoints/receptions-avelon.model";
import {ModalController} from "@ionic/angular";
import {FormExpeditionProviderComponent} from "./components/form-expedition-provider/form-expedition-provider.component";
import {InfoExpeditionsComponent} from "./modals/info-expeditions/info-expeditions.component";
import {ReceptionAvelonProvider} from "../../../services/src/providers/reception-avelon/reception-avelon.provider";

@Component({
  selector: 'suite-expeditions-pending-app',
  templateUrl: './expeditions-pending-app.component.html',
  styleUrls: ['./expeditions-pending-app.component.scss']
})
export class ExpeditionsPendingAppComponent implements OnInit {

  @ViewChild(FormExpeditionInfoComponent) formExpeditionInfo: FormExpeditionInfoComponent;
  @ViewChild(FormExpeditionProviderComponent) formExpeditionProvider: FormExpeditionProviderComponent;

  private lastExepeditionQueried = {reference: null, providerId: null};

  constructor(
    private router: Router,
    private modalController: ModalController,
    private receptionsAvelonService: ReceptionsAvelonService,
    private intermediaryService: IntermediaryService,
    private receptionAvelonProvider: ReceptionAvelonProvider
  ) {}

  ngOnInit() {}

  public searchExpeditions(data) {
    if (data.number_expedition) {
      this.checkExpedition(data.number_expedition);
    } else if (data.provider_expedition) {
      this.listByProvider(data.provider_expedition.id);
    }
  }

  // check if the expedition selected by reference is available and get her data
  public checkExpedition(expeditionReference) {
    this.formExpeditionInfo.checkingExpeditionInProcess = true;
    this.receptionsAvelonService
      .checkExpeditionByReference(expeditionReference)
      .subscribe(async (res) => {
        if (res.code == 200) {
          if (res.data.expedition_available) {
            const modal = await this.modalController.create({
              component: InfoExpeditionsComponent,
              componentProps: {
                expedition: res.data.expedition,
                anotherExpeditions: res.data.another_expeditions
              }
            });
            modal.onDidDismiss().then(response => {
              if (response.data && response.data.reception && response.data.expedition) {
                const expedition: ReceptionAvelonModel.Expedition = response.data.expedition;
                this.lastExepeditionQueried = {
                  reference: expedition.reference,
                  providerId: expedition.provider_id
                };

                this.receptionAvelonProvider.expeditionData = this.lastExepeditionQueried;
                this.router.navigate(['receptions-avelon', 'app']);
              }
            });
            modal.present();

            this.formExpeditionInfo.checkingExpeditionInProcess = false;
          } else {
            this.intermediaryService.presentWarning(`No hay ninguna expedición con referencia ${res.data.expedition_reference_queried} pendiente de recepción.`, null);
            this.formExpeditionInfo.checkingExpeditionInProcess = false;
          }
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar consultar la expedición indicada.';
          if (res.error && res.error.errors) {
            errorMessage = res.error.errors;
          }
          this.intermediaryService.presentToastError(errorMessage);
          this.formExpeditionInfo.checkingExpeditionInProcess = false;
        }
      }, (e) => {
        let errorMessage = 'Ha ocurrido un error al intentar consultar la expedición indicada.';
        if (e.error && e.error.errors) {
          errorMessage = e.error.errors;
        }
        this.intermediaryService.presentToastError(errorMessage);
        this.formExpeditionInfo.checkingExpeditionInProcess = false;
      });
  }

  // check if the provider selected have expeditions to receive
  public listByProvider(providerId) {
    this.formExpeditionProvider.checkingExpeditionInProcess = true;
    this.receptionsAvelonService
      .checkExpeditionsByProvider(providerId)
      .subscribe(async (res) => {
        if (res.code == 200) {
          if (res.data.has_expeditions) {
            const modal = await this.modalController.create({
              component: InfoExpeditionsComponent,
              componentProps: {
                anotherExpeditions: res.data.expeditions,
                title: `Expediciones para ${res.data.provider_queried}`,
                titleAnotherExpeditions: 'Listado de expediciones'
              }
            });
            modal.onDidDismiss().then(response => {
              if (response.data && response.data.reception && response.data.expedition) {
                const expedition: ReceptionAvelonModel.Expedition = response.data.expedition;
                this.lastExepeditionQueried = {
                  reference: expedition.reference,
                  providerId: expedition.provider_id
                };

                this.receptionAvelonProvider.expeditionData = this.lastExepeditionQueried;
                this.router.navigate(['receptions-avelon', 'app']);
              }
            });
            modal.present();

            this.formExpeditionProvider.checkingExpeditionInProcess = false;
          } else {
            this.intermediaryService.presentWarning(`No hay expediciones pendientes para el proveedor ${res.data.provider_queried}.`, null);
            this.formExpeditionProvider.checkingExpeditionInProcess = false;
          }
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar consultar la expedición indicada.';
          if (res.error && res.error.errors) {
            errorMessage = res.error.errors;
          }
          this.intermediaryService.presentToastError(errorMessage);
          this.formExpeditionProvider.checkingExpeditionInProcess = false;
        }
      }, (e) => {
        let errorMessage = 'Ha ocurrido un error al intentar consultar las expediciones del proveedor.';
        if (e.error && e.error.errors) {
          errorMessage = e.error.errors;
        }
        this.intermediaryService.presentToastError(errorMessage);
        this.formExpeditionProvider.checkingExpeditionInProcess = false;
      });
  }
}
