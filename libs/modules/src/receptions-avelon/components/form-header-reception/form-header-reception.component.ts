import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IntermediaryService, ReceptionAvelonModel, ReceptionsAvelonService} from "@suite/services";
import {Type} from "../../enums/type.enum";
import {VirtualKeyboardService} from "../../../components/virtual-keyboard/virtual-keyboard.service";
import {LoadingButtonComponent} from "../../../components/button/loading-button/loading-button.component";
import {LocalStorageProvider} from "../../../../../services/src/providers/local-storage/local-storage.provider";
declare const BrowserPrint: any;

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
  public listProvidersToKeyboard: {id: number, value: string}[] = [];
  public lastExepeditionQueried = {reference: null, providerId: null};

  constructor(
    private virtualKeyboardService: VirtualKeyboardService,
    private receptionsAvelonService: ReceptionsAvelonService,
    private localStorageProvider: LocalStorageProvider,
    private intermediaryService: IntermediaryService
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
        this.listProvidersToKeyboard = this.listProviders.map(p => {return {id: p.id, value: p.name};});
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
    if (!this.virtualKeyboardService.aKeyboardIsOpen) {
      let dataList: {id: number, value: string}[] = [];

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
          dataList = this.listProvidersToKeyboard;
          break;
      }

      let keyboardEventEmitterSubscribe = this.virtualKeyboardService.eventEmitter
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

      const callbackDismissKeyboard = () => {
        this.virtualKeyboardService.aKeyboardIsOpen = false;
        if (keyboardEventEmitterSubscribe) {
          keyboardEventEmitterSubscribe.unsubscribe();
          keyboardEventEmitterSubscribe = null;
        }
      };
      this.virtualKeyboardService.openVirtualKeyboard({dataList, type, placeholder: placeholderText, initialValue: initialValue}, callbackDismissKeyboard);
    }
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

  printZebraTest(){
    console.log("BrowserPrint::printZebraTest");
    const dataToPrint = "^XA^CI28^LH30,5^AVN^FO1,5^FDPRUEBA^FS^AVN^FO0,15^FB325,1,0,R,0^FD00^FS^ABN^FO3,70^FDMARCA^FS^ABN^FO3,85^FDMODELO^FS^ABN^FO3,100^FDCOLOR^FS^AQN^FO0,110^FB325,1,0,R,0^FDTEMP^FS^FO10,125^BY2,3.0^BCN,40,Y,N,N^FD>;000000000000000000^FS^XZ";
    if(BrowserPrint){
      BrowserPrint.getDefaultDevice("printer", function(device) {
        console.log("BrowserPrint::device", device);
        if(device){
          console.log("BrowserPrint::send", dataToPrint)
          device.send(dataToPrint, function (data) {
            console.log("BrowserPrint::data", data);
          }, function (e) {
            console.log("BrowserPrint::Error send", e);
            this.intermediaryService.presentToastError('Error enviando datos a la impresora');
          });
        } else {
          this.intermediaryService.presentToastError('No hay impresora por defecto de Browser Print');
        }
      }, function(error){
        this.intermediaryService.presentToastError('Error obteniendo impresora por defecto de Browser Print');
        console.log("BrowserPrint::Error getDevice", error)
      });
    } else {
      this.intermediaryService.presentToastError('Browser Print no instalado');
      console.log("BrowserPrint not installed")
    }

  }
}
