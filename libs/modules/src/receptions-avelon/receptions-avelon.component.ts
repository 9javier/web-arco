import {AlertController, ModalController} from '@ionic/angular';
import {Observable, Subscription} from 'rxjs';
import {ReceptionsAvelonService, ReceptionAvelonModel, IntermediaryService, ProductsService, environment} from '@suite/services';
import {Component, OnInit, OnDestroy, ViewChild, AfterContentInit, ChangeDetectorRef, ElementRef, AfterViewInit} from '@angular/core';
import { Type } from './enums/type.enum';
import { VirtualKeyboardService } from '../components/virtual-keyboard/virtual-keyboard.service';
import { Reception } from './classes/reception.class';
import { ListsComponent } from './components/lists/lists.component';
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {InfoModalComponent} from "./info-modal/info-modal.component";
import {PositionsToast} from "../../../services/src/models/positionsToast.type";
import {ScreenResult} from "./enums/screen_result.enum";
import {FormHeaderReceptionComponent} from "./components/form-header-reception/form-header-reception.component";
import {InfoHeaderReceptionComponent} from "./components/info-header-reception/info-header-reception.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {WebsocketService} from '../../../services/src/lib/endpoint/web-socket/websocket.service';
import {type} from '../../../services/src/lib/endpoint/web-socket/enums/typeData';
import {StateExpeditionAvelonService} from "../../../services/src/lib/endpoint/state-expedition-avelon/state-expedition-avelon.service";
import {StatesExpeditionAvelonProvider} from "../../../services/src/providers/states-expetion-avelon/states-expedition-avelon.provider";
import {ActivatedRoute} from "@angular/router";
import {TypeModelVisualization} from "./enums/model_visualization.enum";

@Component({
  selector: 'suite-receptions-avelon',
  templateUrl: './receptions-avelon.component.html',
  styleUrls: ['./receptions-avelon.component.scss'],
  animations: [
    trigger('fadein', [
      state('out', style({ opacity: 0, display: 'none' })),
      transition('in => out', [
        style({ opacity: 1, display: 'flex' }),
        animate('300ms ease-out', style({ opacity: 0, display: 'none' }))
      ]),
      transition('out => in', [
        style({ opacity: 0, display: 'none' }),
        animate('1ms ease-out', style({ opacity: 1, display: 'flex' }))
      ])
    ])
  ]
})
export class ReceptionsAvelonComponent implements OnInit, OnDestroy, AfterContentInit, AfterViewInit {

  @ViewChild(ListsComponent) listsComponent:ListsComponent;
  @ViewChild('provider') providerInput: ElementRef;
  @ViewChild('expedition') expeditionInput: ElementRef;
  @ViewChild('ean') eanInput: ElementRef;
  @ViewChild(FormHeaderReceptionComponent) formHeaderReceptionComponent: FormHeaderReceptionComponent;
  @ViewChild(InfoHeaderReceptionComponent) infoHeaderReceptionComponent: InfoHeaderReceptionComponent;

  public stateAnimationForm: string = 'in';
  public stateAnimationInfo: string = 'out';

  public expedit:string="";
  expeditionLines: {
    id: number,
    state: number,
    brandId: number,
    modelId: number,
    colorId: number
  }[];
  response: ReceptionAvelonModel.Reception;
  oldBrands: ReceptionAvelonModel.Data[] = [];
  subscriptions: Subscription[] = [];
  providers: Array<any>;
  isReceptionStarted: boolean;
  expedition: string;
  providerId: number;
  deliveryNote: string;
  interval: any;
  option: any;
  typeScreen: number;
  referencesToPrint: string[];
  filter;
  objectType = Type;
  filterData: ReceptionAvelonModel.Reception;
  result: ReceptionAvelonModel.Print = {
    reference: undefined,
    brandId: undefined,
    colorId: undefined,
    sizeId: undefined,
    modelId: undefined,
    providerId: undefined,
    expedition: '',
    ean: ''
  };
  oldEan = '';
  providersAux;
  value;
  myControl = new FormControl();
  filteredProviders: Observable<any[]>;
  showCheck: boolean = true;
  modelSelected: any = null;

  public listSizes: ReceptionAvelonModel.LoadSizesList[] = [];
  private expeditionStarted = null;

  isReceptionWithoutOrder: boolean = false;

  public TypesModel = TypeModelVisualization;
  public typeModelVisualization: number = TypeModelVisualization.MODEL_NAME;
  public lastTypeModelVisualization: number = TypeModelVisualization.MODEL_NAME;

  constructor(
    private activatedRoute: ActivatedRoute,
    private reception: ReceptionsAvelonService,
    private intermediaryService: IntermediaryService,
    private alertCtrl: AlertController,
    private virtualKeyboardService: VirtualKeyboardService,
    private modalController: ModalController,
    private cd: ChangeDetectorRef,
    private websocketService : WebsocketService,
    private stateExpeditionAvelonService: StateExpeditionAvelonService,
    private stateExpeditionAvelonProvider: StatesExpeditionAvelonProvider
  ) {}

  ngOnInit() {
    this.typeModelVisualization = TypeModelVisualization.MODEL_NAME;
    this.isReceptionWithoutOrder = !!(this.activatedRoute.snapshot && this.activatedRoute.snapshot.routeConfig && this.activatedRoute.snapshot.routeConfig.path && this.activatedRoute.snapshot.routeConfig.path == 'free');

    this.intermediaryService.presentLoading('Cargando');
    this.response = new Reception();
    this.filterData = new Reception();
    this.typeScreen = undefined;
    this.referencesToPrint = [];
    this.isReceptionStarted = false;
    this.deliveryNote = null;
    this.expeditionStarted = null;
    this.subscriptions.push(this.reception.getAllProviders().subscribe(
      (data: Array<ReceptionAvelonModel.Providers>) => {
        this.providers = data;
        this.providersAux = data;
      },
      e => {
        this.intermediaryService.dismissLoading();
      },
      () => {
        this.filteredProviders = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.providers.slice())
          );
        this.intermediaryService.dismissLoading();
      }
    ));
    this.stateExpeditionAvelonService.getIndex().subscribe(response=>{
      this.stateExpeditionAvelonProvider.states = response;
    });
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error('Error to try unsubscribe of some observable');
      }
    }
    clearInterval(this.interval);
  }

  ngAfterContentInit() {
    this.cd.detectChanges()
  }

  ngAfterViewInit() {
    this.listSelected();
    this.clickSizeSelected();
    this.getEmitEan();
  }

  resetReceptionProcess(){
    this.eanInput.nativeElement.value = "";
    this.result.ean = null;
    this.listSizes = [];

    this.stateAnimationForm = 'in';
    this.stateAnimationInfo = 'out';
    this.isReceptionStarted = false;
    this.formHeaderReceptionComponent.resetProcess();
    this.infoHeaderReceptionComponent.loadInfoExpedition({packingsPallets: null, provider: null, expeditionReference: null, date: null, shipper: null, states: null});
    this.deliveryNote = null;
    this.expeditionStarted = null;

    this.typeModelVisualization = TypeModelVisualization.MODEL_NAME;

    this.ngOnInit();
  }

  public changeDeliveryNote(deliveryNote) {
    this.deliveryNote = deliveryNote;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.providers.filter(provider => provider.name.toLowerCase().indexOf(filterValue) === 0);
  }

  openVirtualKeyboard(list?: Array<ReceptionAvelonModel.Data>, type?: Type) {
    const dataList = [];

    if(list) {
      list.forEach(item => {
        dataList.push({id: item.id, value: item.name, color: item.color});
      });
    }

    const keyboardEventEmitterSubscribe = this.virtualKeyboardService.eventEmitter.subscribe(
      data => {
        let dato;
        if (data.selected) {
          switch (data.selected.type) {
            case Type.BRAND:
              dato = this.response.brands.find(elem => elem.id === data.selected.id);
              this.updateList(dato);
              break;
            case Type.COLOR:
              dato = this.response.colors.find(elem => elem.id === data.selected.id);
              this.updateList(dato);
              break;
            case Type.MODEL:
              dato = this.response.models.find(elem => elem.id === data.selected.id);
              this.updateList(dato);
              break;
            case Type.PROVIDER:
              this.providerInput.nativeElement.value = data.selected.id;
              break;
            case Type.EXPEDITION_NUMBER:
              this.expeditionInput.nativeElement.value = data.selected.id;
              break;
            case Type.EAN_CODE:
              this.eanInput.nativeElement.value = data.selected.id;
              this.result.ean = this.eanInput.nativeElement.value;
              this.sizeSelectedInSelector(null);
              break;
            case undefined:
              this.expedition = data.selected.id;
              break;
          }
        }
      }
    );

    this.virtualKeyboardService
      .openVirtualKeyboard({dataList, type})
      .then((popover: any) => {
        popover.onDidDismiss().then(() => {
          keyboardEventEmitterSubscribe.unsubscribe();
        });
      });
  }

  async checkProvider(data: ReceptionAvelonModel.CheckProvider) {
    this.expedition = data.expedition;
    this.providerId = data.providerId;

    await this.intermediaryService.presentLoading('Cargando');
    this.reception.getReceptions(data.providerId).subscribe((info: ReceptionAvelonModel.Reception) => {
      this.response = info;
      this.expeditionLines = info.lines;
      this.response.brands = this.clearSelected(this.response.brands);
      this.response.models = this.clearSelected(this.response.models);
      this.response.colors = this.clearSelected(this.response.colors);
      this.filterData.brands = this.clearSelected(info.brands);
      this.filterData.models = this.clearSelected(info.models);
      this.filterData.colors = this.clearSelected(info.colors);

      this.reset();
      this.expedition = data.expedition;

    },error => {}, async () => await this.intermediaryService.dismissLoading());
  }

  async alertMessage(message: string) {
    // Import the AlertController from ionic package
    // Consume it in the constructor as 'alertCtrl'
    const alert = await this.alertCtrl.create({
      header: 'Alerta',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  clickSizeSelected() {
    this.reception.getEmitSizes().subscribe((e: any) => {
      if (e && e.dato) {
        if (e.dato.selected) {
          this.result.sizeId = e.dato.id;
        } else {
          this.result.sizeId = undefined;
        }
      } else {
        this.result.sizeId = undefined;
      }
    })
  }

  updateList(dato) {
    let model = [];
    let brand = [];
    let size = [];
    let color = [];

    if (dato.belongsModels) {
      dato.belongsModels.forEach(modelId => {
        const modelsFilter = this.response.models.filter(model => !!model.available_ids.find(id => id == modelId));
        modelsFilter.forEach(m => {
          const modelFind = model.find(elem => elem.id == m.id);
          if(modelFind === undefined) {
            model.push(m)
          }
        });
        /***************************brands******************************/
        const brandsFilter = this.response.brands.filter(elem => {
          if(elem.belongsModels.find(elem => elem === modelId)){
            return elem
          }
        });
        brandsFilter.forEach(elem => {
          if(brand.find(data => data.id === elem.id) === undefined) {
            brand.push(elem)
          }
        });

        /*****************************color****************************/
        const colorFilter = this.response.colors.filter(elem => {
          if(elem.belongsModels.find(elem => elem === modelId)){
            return elem
          }
        });
        colorFilter.forEach(elem => {
          if(color.find(data => data.id === elem.id) === undefined) {
            color.push(elem)
          }
        })
      })
    } else {
      const modelsFilter = this.response.models.filter(model => model.id === dato.id);
      modelsFilter.forEach(m => {
        const modelFind = model.find(elem => elem.id == m.id);
        if (modelFind === undefined) {
          model.push(m)
        }
      });

      /***************************brands******************************/
      const brandsFilter = this.response.brands.filter(elem => !!elem.belongsModels.find(model => !!dato.available_ids.find(id => id == model)));
      brandsFilter.forEach(elem => {
        if (brand.find(data => data.id === elem.id) === undefined) {
          brand.push(elem)
        }
      });

      /*****************************color****************************/
      const colorFilter = this.response.colors.filter(elem => !!elem.belongsModels.find(model => !!dato.available_ids.find(id => id == model)));
      colorFilter.forEach(elem => {
        if (color.find(data => data.id === elem.id) === undefined) {
          color.push(elem)
        }
      })
    }

    if (model.length > 0) {
      this.response.models = model;
      this.reception.setModelsList(model);
      if (this.response.models.length == 1) {
        this.result.modelId = this.response.models[0].id;
        this.response.models[0].selected = true;
      }
    }
    if (brand.length > 0) {
      this.response.brands = brand;
      this.reception.setBrandsList(brand);
      if (this.response.brands.length == 1) {
        this.result.brandId = this.response.brands[0].id;
        this.response.brands[0].selected = true;
      }
    }
    if (color.length > 0) {
      this.response.colors = color;
      this.reception.setColorsList(color);
      if (this.response.colors.length == 1) {
        this.result.colorId = this.response.colors[0].id;
        this.response.colors[0].selected = true;
      }
    }

    if (this.result.modelId && this.result.colorId) {
      this.loadSizes();
    }
  }

  reset(dato?: ReceptionAvelonModel.Data) {
    this.response.models = this.filterData.models;
    this.response.colors = this.filterData.colors;
    this.response.brands = this.filterData.brands;
    this.reception.setModelsList(this.response.models);
    this.reception.setBrandsList(this.response.brands);
    this.reception.setColorsList(this.response.colors);
  }

  resetAll() {
    this.intermediaryService.presentLoading('Recargando', () => {
      this.response.models = this.filterData.models;
      this.response.models.map(elem => elem.selected = false);
      this.response.colors = this.filterData.colors;
      this.response.colors.map(elem => elem.selected = false);
      this.response.brands = this.filterData.brands;
      this.response.brands.map(elem => elem.selected = false);

      this.result.modelId = undefined;
      this.result.brandId = undefined;
      this.result.sizeId = undefined;
      this.result.colorId = undefined;
      this.modelSelected = null;

      this.reception.setModelsList(this.response.models);
      this.reception.setBrandsList(this.response.brands);
      this.reception.setColorsList(this.response.colors);

      this.expedit = this.expedition;
      this.result.ean="";
      this.listSizes = [];
      this.intermediaryService.dismissLoading();
    });
  }

  resetSizes(){
    for(let size of this.listSizes){
      size.quantity = 0;
    }
  }

  goBack(type: string) {

    switch (type) {
      case 'brands':
        if(this.oldBrands.length > 0) {
          this.response.brands = JSON.parse(JSON.stringify(this.oldBrands));
        }else{
          this.response.brands = this.filterData.brands;
        }
        for (let brand of this.response.brands) {
          brand.selected = false;
        }
        this.reception.setBrandsList(this.response.brands);
        break;
      case 'models':
        const models = this.filterData.models;
        if(this.result.colorId){
          this.response.models = [];
          const color = this.filterData.colors.find(c => c.id == this.result.colorId);
          for(let model of models){
            if(color.belongsModels.includes(model.id)){
              model.selected = false;
              this.response.models.push(model);
            }else{
              for(let modelId of model.available_ids){
                if(color.belongsModels.includes(modelId)){
                  model.selected = false;
                  this.response.models.push(model);
                  break;
                }
              }
            }
          }
        }else{
          for(let model of models) {
            model.selected = false;
          }
          this.response.models = models;
        }
        this.reception.setModelsList(this.response.models);
        break;
      case 'colors':
        const colors = this.filterData.colors;
        if(this.result.modelId){
          this.response.colors = [];
          const model = this.filterData.models.find(m => m.id == this.result.modelId);
          for(let color of colors){
            if(color.belongsModels.includes(model.id)){
              color.selected = false;
              this.response.colors.push(color);
            }else{
              for(let modelId of model.available_ids){
                if(color.belongsModels.includes(modelId)){
                  color.selected = false;
                  this.response.colors.push(color);
                  break;
                }
              }
            }
          }
        }else{
          for(let color of colors) {
            color.selected = false;
          }
          this.response.colors = colors;
        }
        this.reception.setColorsList(this.response.colors);
    }

  }

  listSelected() {
    this.subscriptions.push(this.reception.getEmitList().subscribe((event: any) => {
      switch (event.type) {
        case 'brands':
          if (event.dato.selected) {
            this.oldBrands = JSON.parse(JSON.stringify(this.response.brands));
            this.result.brandId = event.dato.id;
            setTimeout(() => {
              this.updateList(event.dato);
            }, 0);
          } else {
            this.result.brandId = undefined;
            this.goBack('brands');
            if(!this.result.modelId){
              this.goBack('models');
            }
            if(!this.result.colorId){
              this.goBack('colors');
            }
          }
          this.getModelAndColorColors(this.result.brandId);
          break;
        case 'models':
          if (event.dato.selected) {
            this.result.modelId = event.dato.id;
            this.modelSelected = event.dato;
            setTimeout(() => {
              this.updateList(event.dato);
            }, 0);
          } else {
            this.result.modelId = undefined;
            this.modelSelected = null;
            this.goBack('models');
            if (!this.result.brandId) {
              this.goBack('brands');
            }
            if (!this.result.colorId) {
              this.goBack('colors');
            }
          }
          this.getColorColors(this.result.modelId);
          break;
        case 'colors':
          if (event.dato.selected) {
            this.result.colorId = event.dato.id;
            if (this.modelSelected) {
              this.result.modelId = this.modelSelected.available_ids.find(id => event.dato.belongsModels.find(model => model == id));
            }
            setTimeout(() => {
              this.updateList(event.dato);
            }, 0);
          } else {
            this.result.colorId = undefined;
            this.goBack('colors');
            if (!this.result.brandId) {
              this.goBack('brands');
            }
            if (!this.result.modelId) {
              this.goBack('models');
            }
          }
          break;
      }

    }));
  }

  getModelAndColorColors(brandId: number){
    let greenModels: number[] = [];
    let orangeModels: number[] = [];
    let greenColors: number[] = [];
    let orangeColors: number[] = [];
    for(let line of this.expeditionLines){
      if(!brandId || line.brandId == brandId){
        if(line.state == 2){
          if(!greenModels.includes(line.modelId)){
            greenModels.push(line.modelId);
          }
          if(!greenColors.includes(line.colorId)){
            greenColors.push(line.colorId);
          }
        }else{
          if(!orangeModels.includes(line.modelId)){
            orangeModels.push(line.modelId);
          }
          if(!orangeColors.includes(line.colorId)){
            orangeColors.push(line.colorId);
          }
        }
      }
    }
    orangeModels = orangeModels.filter(model => {return !greenModels.includes(model)});
    orangeColors = orangeColors.filter(color => {return !greenColors.includes(color)});
    for(let model of this.response.models){
      if(greenModels.includes(model.id)){
        model.color = 'green';
      }else{
        if(orangeModels.includes(model.id)){
          model.color = 'orange';
        }else{
          model.color = 'red';
        }
      }
    }
    for(let color of this.response.colors){
      if(greenColors.includes(color.id)){
        color.color = 'green';
      }else{
        if(orangeColors.includes(color.id)){
          color.color = 'orange';
        }else{
          color.color = 'red';
        }
      }
    }
    this.reception.setModelsList(this.response.models);
    this.reception.setColorsList(this.response.colors);
  }

  getColorColors(modelId: number){
    let greenColors: number[] = [];
    let orangeColors: number[] = [];
    for(let line of this.expeditionLines){
      if(!modelId || line.modelId == modelId){
        if(line.state == 2 && !greenColors.includes(line.colorId)){
          greenColors.push(line.colorId);
        }else{
          if(line.state != 2 && !orangeColors.includes(line.colorId)){
            orangeColors.push(line.colorId);
          }
        }
      }
    }
    orangeColors = orangeColors.filter(color => {return !greenColors.includes(color)});
    for(let color of this.response.colors){
      if(greenColors.includes(color.id)){
        color.color = 'green';
      }else{
        if(orangeColors.includes(color.id)){
          color.color = 'orange';
        }else{
          color.color = 'red';
        }
      }
    }
    this.reception.setColorsList(this.response.colors);
  }

  public sizeSelectedInSelector(item: ReceptionAvelonModel.LoadSizesList) {
    for (let size of this.listSizes) {
      if ((item && size.id != item.id) || !item) {
        size.quantity = 0;
      }
    }
  }

  public removeEanCode(event) {
    event.preventDefault();
    event.stopPropagation();
    this.result.ean = null;
  }

  public printProductsLoading() {
    this.intermediaryService.presentLoading('Enviando').then(() => this.printProducts());
  }

  private printProducts() {
    if (!this.providerId || !this.expedition) {
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError('No se detectan el proveedor y la expedición asignados. Pruebe a reiniciar el proceso. Si persiste el error contacte con su responsable.');
    } else {
      const eanSet = this.eanInput.nativeElement.value;
      if (eanSet && eanSet != this.oldEan) {
        this.checkEanAndPrint(eanSet);
      } else {
        if (this.checkIfSelectMandatoryFields()) {
          this.notifyReceptionAndPrint();
        } else {
          this.intermediaryService.dismissLoading();
        }
      }
    }
  }

  clearSelected(array: Array<ReceptionAvelonModel.Data>) {
    array.map(element => {
      element.state = 0;
      if (element.selected) {
        element.selected = false;
      }
    });
    return array;
  }

  async screenExit(e) {
    this.typeScreen = undefined;
    this.referencesToPrint = [];
    this.resetAll();
    setTimeout(() => this.infoHeaderReceptionComponent.loadInfoExpedition(
      {
        expeditionReference: this.expeditionStarted.reference,
        provider: {name: this.expeditionStarted.providerName, id: this.expeditionStarted.providerId},
        states: this.expeditionStarted.receptionStates,
        shipper: this.expeditionStarted.shipper,
        date: this.expeditionStarted.deliveryDate,
        packingsPallets: {packings: this.expeditionStarted.receptionPackings, pallets: this.expeditionStarted.receptionPallets}
      },
      this.deliveryNote
    ), 1000);
  }

  async load(e, item) {
    this.expedition = this.expeditionInput && this.expeditionInput.nativeElement && this.expeditionInput.nativeElement.value ? this.expeditionInput.nativeElement.value : null;
    this.value = item.name;
    this.filter = false;
    this.providerId = item.id;
    const data: ReceptionAvelonModel.CheckProvider = {
      expedition: this.expedition,
      providerId: this.providerId
    };

    if (data.expedition === undefined || data.expedition.length === 0) {
      this.alertMessage('Introduzca un número de expedición para poder iniciar la recepción.');
    } else {
      await this.reception.checkExpeditionsByNumberAndProvider({
        expeditionNumber: data.expedition,
        providerId: data.providerId
      }).subscribe(async (response) => {
        if(response.data.expedition_available) {
          const modal = await this.modalController.create({
            component: InfoModalComponent,
            componentProps: {
              expedition: response.data.expedition,
              anotherExpeditions: response.data.another_expeditions
            }
          });

          modal.onDidDismiss().then(async response => {
            if (response.data && response.data.reception) {
              this.showCheck = false;
              this.isReceptionStarted = true;
              await this.checkProvider(data);
            }
          });

          modal.present();
        }else{
          this.isReceptionStarted = false;
          this.alertMessage('No se ha encontrado esa expedición');
        }
      });
    }
  }

  private loadSizes() {
    this.reception
      .postLoadSizesList({modelId: this.result.modelId, colorId: this.result.colorId})
      .subscribe((res: ReceptionAvelonModel.ResponseLoadSizesList) => {
        if (res.code == 200) {
          this.listSizes = res.data;
        } else {
          this.intermediaryService.presentToastError('Ha ocurrido un error al intentar cargar las tallas correspondientes.', PositionsToast.BOTTOM);
        }
      }, (error) => {
        this.intermediaryService.presentToastError('Ha ocurrido un error al intentar cargar las tallas correspondientes.', PositionsToast.BOTTOM);
      });
  }

  private checkEanAndPrint(ean) {
    this.reception
      .eanProductPrint(ean, this.expedition, this.providerId)
      .subscribe((resultCheck) => {
        this.intermediaryService.dismissLoading();
        if (resultCheck.resultToPrint && resultCheck.resultToPrint.length > 0) {
          const resultEan = resultCheck.resultToPrint[0];
          this.typeScreen = resultEan.type;
          this.referencesToPrint = [resultEan.reference];
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar comprobar el EAN '+ean+' introducido.';
          if (resultCheck.productsWithError && resultCheck.productsWithError.length > 0) {
            errorMessage = 'EAN ' + ean + ': '+ resultCheck.productsWithError[0].reason;
          }
          this.intermediaryService.presentToastError(errorMessage);
        }
      }, e => {
        if (e.error.code == 400 && e.error.message == 'InvalidEanException') {
          if (this.checkIfSelectMandatoryFields(ean)) {
            if (this.checkOnlyOneSizeAndOneQuantity()) {
              this.notifyReceptionAndPrint(ean);
            } else {
              this.intermediaryService.dismissLoading();
            }
          } else {
            this.intermediaryService.dismissLoading();
          }
        } else {
          this.intermediaryService.dismissLoading();
          let errorMessage = 'Ha ocurrido un error al intentar comprobar el EAN introducido.';
          if (e.error.errors) {
            errorMessage = e.error.errors;
          }
          this.intermediaryService.presentToastError(errorMessage);
        }
      });
  }

  // check if all fields mandatory are selected to receive the product (brand, model, color and at least one size)
  private checkIfSelectMandatoryFields(ean?: string): boolean {
    const errorsMessages: string[] = [];
    const sizesToPrint = this.listSizes.filter(s => {
      return s.quantity > 0;
    });

    if(ean && (!this.result.brandId || !this.result.modelId || !this.result.colorId || sizesToPrint.length <= 0)){
      this.intermediaryService.presentWarning('Código EAN '+ean+ ' no registrado en el sistema. <br><br>Por favor seleccione Marca, Modelo, Color y una talla para imprimir la etiqueta y registrar el EAN en el sistema', null);
      return false;
    }

    if (!this.result.brandId) {
      errorsMessages.push('Una marca.');
    }
    if (!this.result.modelId) {
      errorsMessages.push('Un modelo.');
    }
    if (!this.result.colorId) {
      errorsMessages.push('Un color.');
    }
    if (sizesToPrint.length <= 0) {
      errorsMessages.push('Al menos una talla.');
    }

    if (errorsMessages.length > 0) {
      const messageAsList = errorsMessages.map(m => `<li>${m}</li>`);
      this.intermediaryService.presentWarning('Se ha detectado que faltan campos por seleccionar para poder realizar la recepción del producto y la impresión de su código único. Para poder continuar compruebe que ha seleccionado: <ul>' + messageAsList + '</ul>', null);
      return false;
    } else {
      return true;
    }
  }

  // check that user only has selected one size and one unity for that size to associate to EAN code
  private checkOnlyOneSizeAndOneQuantity(): boolean {
    const sizesToPrint = this.listSizes.filter(s => {
      return s.quantity > 0;
    });
    if (sizesToPrint.length > 1) {
      this.intermediaryService.presentWarning('Seleccione solo una talla para asociar al EAN escaneado. Asegúrese de que solo ha indicado 1 Ud. de la talla que desea asociar al código.', null);
      return false;
    } else if (sizesToPrint[0].quantity > 1) {
      this.intermediaryService.presentWarning('Solo puede asociar a este EAN 1 Ud. de la talla indicada.', null);
      return false;
    }

    return true;
  }

  // notify as received all products selected (with multiple sizes) and redirect user to location page (sorter or warehouse)
  private notifyReceptionAndPrint(eanToAssociate: string = null) {
    const paramsRequest = [];

    const sizesToPrint = this.listSizes.filter(s => {
      return s.quantity > 0;
    });
    const sizesMapped = sizesToPrint.map(s => {
      const sizeMapped: any = {
        providerId: this.providerId,
        expedition: this.expedition,
        brandId: this.result.brandId,
        colorId: this.result.colorId,
        sizeId: s.id,
        modelId: this.result.modelId,
        quantity: s.quantity
      };
      if (eanToAssociate) {
        sizeMapped.ean = eanToAssociate;
      }
      return sizeMapped;
    });
    for (let size of sizesMapped) {
      for (let q = 0; q < size.quantity; q++) {
        paramsRequest.push(size);
      }
    }

    let params: ReceptionAvelonModel.ParamsToPrint = {
      to_print: paramsRequest
    };
    if (this.deliveryNote) {
      params.delivery_note = this.deliveryNote;
    }

    const subscribeResponseOk = (res) => {
      // refresh the data
      this.reception
        .getReceptions(this.providerId)
        .subscribe((info: ReceptionAvelonModel.Reception) => {
          this.response = info;
          this.response.brands = this.clearSelected(this.response.brands);
          this.response.models = this.clearSelected(this.response.models);
          this.response.colors = this.clearSelected(this.response.colors);
        });

      if (res.resultToPrint && res.resultToPrint.length > 0) {
        const someProductToSorter = !!res.resultToPrint.find(r => r.type == ScreenResult.SORTER_VENTILATION);

        if (someProductToSorter) {
          this.typeScreen = ScreenResult.SORTER_VENTILATION;
        } else {
          this.typeScreen = ScreenResult.WAREHOUSE_LOCATION;
        }

        this.referencesToPrint = res.resultToPrint.map(r => r.reference);
      }

      if (res.productsWithError && res.productsWithError.length > 0) {
        let errorMessage = `No se han podido generar e imprimir alguna de las etiquetas necesarias (${res.productsWithError.length}). <br/>Se detalla la incidencia a continuación: <ul>`;
        for (let error of res.productsWithError) {
          errorMessage += `<li>${error.reason}</li>`
        }
        errorMessage += '</ul>';
        this.intermediaryService.presentWarning(errorMessage, null);
        this.intermediaryService.presentToastError('Ha ocurrido un error inesperado al intentar imprimir algunas de las etiquetas necesarias.');
      }
      this.intermediaryService.dismissLoading();
    };
    const subscribeResponseError = (error) => {
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError('Ha ocurrido un error al intentar imprimir las etiquetas necesarias.');
    };

    if (this.isReceptionWithoutOrder) {
      this.reception.makeReceptionFree(params).subscribe(subscribeResponseOk, subscribeResponseError);
    } else {
      this.reception.printReceptionLabel(params).subscribe(subscribeResponseOk, subscribeResponseError);
    }
  }

  public getPhotoUrl(modelId): string {
    if (modelId && this.modelSelected && this.modelSelected.photos_models && this.modelSelected.photos_models[modelId]) {
      return environment.urlBase + this.modelSelected.photos_models[modelId];
    } else {
      return '../assets/img/placeholder-product.jpg';
    }
  }

  // check if the expedition selected by reference is available and get her data
  public checkExpedition(data) {
    this.formHeaderReceptionComponent.checkingExpedition(true);
    this.reception
      .checkExpeditionByReference(data)
      .subscribe(async (res) => {
        if (res.code == 200) {
          if (res.data.expedition_available) {
            const modal = await this.modalController.create({
              component: InfoModalComponent,
              componentProps: {
                expedition: res.data.expedition,
                anotherExpeditions: res.data.another_expeditions
              }
            });
            modal.onDidDismiss().then(response => {
              if (response.data && response.data.reception && response.data.expedition) {
                const expedition: ReceptionAvelonModel.Expedition = response.data.expedition;
                const fieldsToLoadData: ReceptionAvelonModel.CheckProvider = {
                  expedition: expedition.reference,
                  providerId: expedition.providerId
                };
                this.checkProvider(fieldsToLoadData);

                this.stateAnimationForm = 'out';
                this.stateAnimationInfo = 'in';
                this.isReceptionStarted = true;

                this.expeditionStarted = expedition;
                this.infoHeaderReceptionComponent.loadInfoExpedition(
                  {
                    expeditionReference: expedition.reference,
                    provider: {name: expedition.providerName, id: expedition.providerId.toString()},
                    packingsPallets: {packings: expedition.receptionPackings, pallets: expedition.receptionPallets},
                    date: expedition.deliveryDate,
                    shipper: expedition.shipper,
                    states: expedition.receptionStates
                  });
              }
            });
            modal.present();

            this.formHeaderReceptionComponent.checkingExpedition(false);
          } else {
            this.isReceptionStarted = false;
            this.alertMessage(`No hay ninguna expedición con referencia ${res.data.expedition_reference_queried} pendiente de recepción.`);
            this.formHeaderReceptionComponent.checkingExpedition(false);
          }
        } else {
          this.stateAnimationForm = 'in';
          this.stateAnimationInfo = 'out';
          this.isReceptionStarted = false;
          let errorMessage = 'Ha ocurrido un error al intentar consultar la expedición indicada.';
          if (res.error && res.error.errors) {
            errorMessage = res.error.errors;
          }
          this.intermediaryService.presentToastError(errorMessage);
          this.formHeaderReceptionComponent.checkingExpedition(false);
        }
      }, (e) => {
        this.stateAnimationForm = 'in';
        this.stateAnimationInfo = 'out';
        this.isReceptionStarted = false;
        let errorMessage = 'Ha ocurrido un error al intentar consultar la expedición indicada.';
        if (e.error && e.error.errors) {
          errorMessage = e.error.errors;
        }
        this.intermediaryService.presentToastError(errorMessage);
        this.formHeaderReceptionComponent.checkingExpedition(false);
      });
  }

  // check if the provider selected have expeditions to receive
  public listByProvider(data) {
    this.formHeaderReceptionComponent.checkingProvider(true);
    this.reception
      .checkExpeditionsByProvider(data)
      .subscribe(async (res) => {
        if (res.code == 200) {
          if (res.data.has_expeditions) {
            const modal = await this.modalController.create({
              component: InfoModalComponent,
              componentProps: {
                anotherExpeditions: res.data.expeditions,
                title: `Expediciones para ${res.data.provider_queried}`,
                titleAnotherExpeditions: 'Listado de expediciones'
              }
            });
            modal.onDidDismiss().then(response => {
              if (response.data && response.data.reception && response.data.expedition) {
                const expedition: ReceptionAvelonModel.Expedition = response.data.expedition;
                const fieldsToLoadData: ReceptionAvelonModel.CheckProvider = {
                  expedition: expedition.reference,
                  providerId: expedition.providerId
                };
                this.checkProvider(fieldsToLoadData);

                this.stateAnimationForm = 'out';
                this.stateAnimationInfo = 'in';
                this.isReceptionStarted = true;

                this.expeditionStarted = expedition;
                this.infoHeaderReceptionComponent.loadInfoExpedition(
                  {
                    expeditionReference: expedition.reference,
                    provider: {name: expedition.providerName, id: expedition.providerId.toString()},
                    packingsPallets: {packings: expedition.receptionPackings, pallets: expedition.receptionPallets},
                    date: expedition.deliveryDate,
                    shipper: expedition.shipper,
                    states: expedition.receptionStates
                  });
              }
            });
            modal.present();

            this.formHeaderReceptionComponent.checkingProvider(false);
          } else {
            this.stateAnimationForm = 'in';
            this.stateAnimationInfo = 'out';
            this.isReceptionStarted = false;
            this.alertMessage(`No hay expediciones pendientes para el proveedor ${res.data.provider_queried}.`);
            this.formHeaderReceptionComponent.checkingProvider(false);
          }
        } else {
          this.stateAnimationForm = 'in';
          this.stateAnimationInfo = 'out';
          this.isReceptionStarted = false;
          let errorMessage = 'Ha ocurrido un error al intentar consultar la expedición indicada.';
          if (res.error && res.error.errors) {
            errorMessage = res.error.errors;
          }
          this.intermediaryService.presentToastError(errorMessage);
          this.formHeaderReceptionComponent.checkingProvider(false);
        }
      }, (e) => {
        this.stateAnimationForm = 'in';
        this.stateAnimationInfo = 'out';
        this.isReceptionStarted = false;
        let errorMessage = 'Ha ocurrido un error al intentar consultar las expediciones del proveedor.';
        if (e.error && e.error.errors) {
          errorMessage = e.error.errors;
        }
        this.intermediaryService.presentToastError(errorMessage);
        this.formHeaderReceptionComponent.checkingProvider(false);
      });
  }

  getEmitEan(){
    this.websocketService.getEmitData().subscribe((x:any)=>{
      if(x.type !== undefined){
        if(x.type === type.OBJECT){
          this.result.ean = x.data.ean;
          this.printProductsLoading();
        }
      }
    });
  }

  //region Selection of data visualization for model
  public changeValue() {
    this.reception
      .postReloadModelsList({typeVisualization: this.typeModelVisualization, providerId: this.providerId})
      .subscribe((res) => {
        this.filterData.models = res.data;
        this.resetAll();
        this.lastTypeModelVisualization = this.typeModelVisualization;
      }, error => {
        console.error('Error reloading models: ', error);
        this.typeModelVisualization = this.lastTypeModelVisualization;
        this.intermediaryService.presentToastError('Ha ocurrido un error al intentar cargar los modelos por el valor seleccionado.');
      });
  }
  //endregion
}
