import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ReceptionAvelonModel, ReceptionsAvelonService} from "@suite/services";
import {Type} from "../../enums/type.enum";
import {VirtualKeyboardService} from "../../../components/virtual-keyboard/virtual-keyboard.service";
import {LoadingButtonComponent} from "../../../components/button/loading-button/loading-button.component";
import {LocalStorageProvider} from "../../../../../services/src/providers/local-storage/local-storage.provider";

@Component({
  selector: 'suite-form-header-reception',
  templateUrl: './form-header-reception.component.html',
  styleUrls: ['./form-header-reception.component.scss']
})
export class FormHeaderReceptionComponent implements OnInit {

  @ViewChild('expedition') expeditionInput: ElementRef;
  @ViewChild('provider') providerInput: ElementRef;
  @ViewChild('loadingButtonExpedition') loadingButtonExpedition: LoadingButtonComponent;
  @ViewChild('loadingButtonResumeExpedition') loadingButtonResumeExpedition: LoadingButtonComponent;
  @ViewChild('loadingButtonProvider') loadingButtonProvider: LoadingButtonComponent;

  @Input() isReceptionWithoutOrder: boolean = false;
  @Output() resumeExpedition = new EventEmitter();
  @Output() checkExpedition = new EventEmitter();
  @Output() listByProvider = new EventEmitter();

  public typesKeyboard = Type;

  public expeditionCode: string = null;
  public providerSelected: ReceptionAvelonModel.Providers = null;

  public listProviders: any[] = [];
  public lastExepeditionQueried = {reference: null, providerId: null};

  constructor(
    private virtualKeyboardService: VirtualKeyboardService,
    private receptionsAvelonService: ReceptionsAvelonService,
    private localStorageProvider: LocalStorageProvider
  ) { }

  ngOnInit() {
    this.loadLastExpeditionStarted();
    this.loadProviders();
  }

  private loadProviders() {
    this.receptionsAvelonService
      .getAllProviders()
      .subscribe((data: Array<ReceptionAvelonModel.Providers>) => {
        this.listProviders = data;
      }, e => {

      });
  }

  private loadLastExpeditionStarted() {
    this.localStorageProvider.get('last_expedition').then(data => {
      this.lastExepeditionQueried = {reference: null, providerId: null};
      if (data) {
        const dataParsed = JSON.parse(String(data));
        if (dataParsed) {
          this.lastExepeditionQueried = dataParsed;
        }
      }
    });
  }

  //region PUBLIC METHODS FOR VIEW
  public showKeyboard(type: Type, list: ReceptionAvelonModel.Data[] = []) {
    const dataList = list.map(l => {return {id: l.id, value: l.name};});

    let placeholderText = '';
    let initialValue = null;

    switch (type) {
      case Type.EXPEDITION_NUMBER:
        placeholderText = 'Código de la expedición';
        initialValue = this.expeditionInput.nativeElement.value;
        break;
      case Type.PROVIDER:
        placeholderText = 'Proveedor';
        initialValue = this.providerInput.nativeElement.value;
        break;
    }

    const keyboardEventEmitterSubscribe = this.virtualKeyboardService.eventEmitter
      .subscribe(data => {
        if (data.selected) {
          switch (data.selected.type) {
            case Type.EXPEDITION_NUMBER:
              this.expeditionInput.nativeElement.value = data.selected.id;
              this.loadingButtonExpedition.isDisabled = !data.selected.id;
              this.clickCheckExpedition();
              break;
            case Type.PROVIDER:
              this.providerInput.nativeElement.value = data.selected.id;
              this.loadingButtonProvider.isDisabled = !data.selected.id;
              this.clickCheckByProvider();
              break;
          }
        }
      });

    this.virtualKeyboardService
      .openVirtualKeyboard({dataList, type, placeholder: placeholderText, initialValue: initialValue})
      .then((popover: any) => {
        popover.onDidDismiss().then(() => {
          keyboardEventEmitterSubscribe.unsubscribe();
        });
      });
  }

  public clickResumeExpedition() {
    this.expeditionCode = this.lastExepeditionQueried.reference;
    this.resumeExpedition.emit(this.expeditionCode);
  }

  public clickCheckExpedition() {
    this.expeditionCode = this.expeditionInput.nativeElement.value;
    this.checkExpedition.emit(this.expeditionCode);
  }

  public clickCheckByProvider() {
    this.providerSelected = this.listProviders.find((provider)=> provider.name == this.providerInput.nativeElement.value);
    this.listByProvider.emit(this.providerSelected.id);
  }
  //endregion

  //region PUBLIC METHODS FOR USE FROM ANOTHER COMPONENTS/PAGES
  public checkingResumeExpedition(isChecking: boolean) {
    this.loadingButtonResumeExpedition.isLoading = isChecking;
  }

  public checkingExpedition(isChecking: boolean) {
    this.loadingButtonExpedition.isLoading = isChecking;
  }

  public checkingProvider(isChecking: boolean) {
    this.loadingButtonProvider.isLoading = isChecking;
  }

  public resetProcess() {
    this.expeditionCode = null;
    this.providerSelected = null;
    this.expeditionInput.nativeElement.value = null;
    this.providerInput.nativeElement.value = null;
    this.loadingButtonResumeExpedition.isDisabled = false;
    this.loadingButtonResumeExpedition.isLoading = false;
    this.loadingButtonExpedition.isDisabled = true;
    this.loadingButtonExpedition.isLoading = false;
    this.loadingButtonProvider.isDisabled = true;
    this.loadingButtonProvider.isLoading = false;
  }

  public saveLastExpeditionStarted(expedition: {reference: string, providerId: number}) {
    this.lastExepeditionQueried = expedition;
    this.localStorageProvider.set('last_expedition', JSON.stringify(expedition));
  }
  //endregion
}
