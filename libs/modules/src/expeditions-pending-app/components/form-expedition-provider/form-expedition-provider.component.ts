import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {ReceptionsAvelonService} from "../../../../../services/src/lib/endpoint/receptions-avelon/receptions-avelon.service";
import {IntermediaryService} from "../../../../../services/src/lib/endpoint/intermediary/intermediary.service";
import {ReceptionAvelonModel} from "../../../../../services/src/models/endpoints/receptions-avelon.model";
import {StateExpeditionAvelonService} from "../../../../../services/src/lib/endpoint/state-expedition-avelon/state-expedition-avelon.service";
import {StatesExpeditionAvelonProvider} from "../../../../../services/src/providers/states-expetion-avelon/states-expedition-avelon.provider";

@Component({
  selector: 'form-expedition-provider',
  templateUrl: './form-expedition-provider.component.html',
  styleUrls: ['./form-expedition-provider.component.scss']
})
export class FormExpeditionProviderComponent implements OnInit, OnDestroy {

  @Input() isReceptionWithoutOrder: boolean = false;
  @Output() checkExpedition: EventEmitter<any> = new EventEmitter();

  public listProviders: ReceptionAvelonModel.Providers[] = [];
  private listProvidersOriginal: ReceptionAvelonModel.Providers[] = [];

  public expeditionForm: FormGroup = null;
  private subscriptionToFormChanges: Subscription = null;
  public checkingExpeditionInProcess: boolean = false;

  constructor(
    private receptionsAvelonService: ReceptionsAvelonService,
    private intermediaryService: IntermediaryService,
    private stateExpeditionAvelonService: StateExpeditionAvelonService,
    private stateExpeditionAvelonProvider: StatesExpeditionAvelonProvider
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.stateExpeditionAvelonService.getIndex().subscribe(response=>{
      this.stateExpeditionAvelonProvider.states = response;
    });
    this.loadProviders();
    this.listenFormChanges();
  }

  ngOnDestroy() {
    if (this.subscriptionToFormChanges) {
      this.subscriptionToFormChanges.unsubscribe();
    }
  }

  public initForm() {
    this.expeditionForm = new FormGroup({
      provider_expedition: new FormControl('')
    });
  }

  private loadProviders() {
    let subscribeLoadProviders = this.receptionsAvelonService
      .getAllProviders()
      .subscribe(
        (data: ReceptionAvelonModel.Providers[]) => {
          if (subscribeLoadProviders) {
            subscribeLoadProviders.unsubscribe();
            subscribeLoadProviders = null;
          }

          this.listProviders = data;
          this.listProvidersOriginal = this.copyItem(this.listProviders);
        }, (e) => {
          if (subscribeLoadProviders) {
            subscribeLoadProviders.unsubscribe();
            subscribeLoadProviders = null;
          }

          this.intermediaryService.presentToastError('Ha ocurrido un error al intentar consultar los proveedores disponibles.', 'bottom');
        }, () => {
          if (subscribeLoadProviders) {
            subscribeLoadProviders.unsubscribe();
            subscribeLoadProviders = null;
          }
        }
      );
  }

  private listenFormChanges() {
    this.subscriptionToFormChanges = this.expeditionForm.valueChanges.subscribe((c) => {
      if (!c.provider_expedition) {
        if (this.listProviders.length != this.listProvidersOriginal.length) {
          this.listProviders = this.copyItem(this.listProvidersOriginal);
        }
      } else {
        let providerWrote = null;
        if (typeof c.provider_expedition == 'string') {
          providerWrote = c.provider_expedition;
        } else {
          providerWrote = c.provider_expedition.name;
        }
        const listProvidersTemp = this.copyItem(this.listProvidersOriginal);
        this.listProviders = listProvidersTemp.filter((s) => {
          return s.name.toUpperCase().includes(providerWrote.toUpperCase());
        });
      }
    });
  }

  public check() {
    if (typeof this.expeditionForm.value.provider_expedition == 'string') {
      const foundItem = this.listProvidersOriginal.find(p => p.name.toUpperCase() == this.expeditionForm.value.provider_expedition.toUpperCase());
      this.expeditionForm.value.provider_expedition = foundItem || {id: null, name: this.expeditionForm.value.provider_expedition};
    }
    this.checkExpedition.next(this.expeditionForm.value);
  }

  public valueToDisplay(provider: ReceptionAvelonModel.Providers): string {
    return provider ? provider.name : null;
  }

  private copyItem(original) {
    return JSON.parse(JSON.stringify(original));
  }
}
