import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {IntermediaryService, ReceptionAvelonModel, ReceptionsAvelonService} from "@suite/services";

@Component({
  selector: 'form-expedition-info',
  templateUrl: './form-expedition-info.component.html',
  styleUrls: ['./form-expedition-info.component.scss']
})
export class FormExpeditionInfoComponent implements OnInit, OnDestroy {

  @Output() checkExpedition: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputExpeditionNumber') inputExpeditionNumber: ElementRef;

  public listProviders: ReceptionAvelonModel.Providers[] = [];
  private listProvidersOriginal: ReceptionAvelonModel.Providers[] = [];

  public expeditionForm: FormGroup = null;
  private subscriptionToFormChanges: Subscription = null;
  public checkingExpeditionInProcess: boolean = false;

  constructor(
    private receptionsAvelonService: ReceptionsAvelonService,
    private intermediaryService: IntermediaryService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadProviders();
    this.listenFormChanges();
    this.focusInExpeditionNumberInput();
  }

  ngOnDestroy() {
    if (this.subscriptionToFormChanges) {
      this.subscriptionToFormChanges.unsubscribe();
    }
  }

  public initForm() {
    this.expeditionForm = new FormGroup({
      number_expedition: new FormControl(''),
      provider_expedition: new FormControl('')
    });
  }

  public resetAutocompleteList() {
    this.listProviders = this.copyItem(this.listProvidersOriginal);
  }

  public focusInExpeditionNumberInput() {
    setTimeout(() => this.inputExpeditionNumber.nativeElement.focus(), 0.5 * 1000);
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

  public valueToReturn(provider: ReceptionAvelonModel.Providers): string {
    return provider ? provider.id : null;
  }

  private copyItem(original) {
    return JSON.parse(JSON.stringify(original));
  }
}
