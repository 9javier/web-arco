import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController, NavParams } from '@ionic/angular';
import { SorterInputService } from '../../../../../services/src/lib/endpoint/sorter-input/sorter-input.service';
import { InputSorterModel } from '../../../../../services/src/models/endpoints/InputSorter';
import { HttpRequestModel } from '../../../../../services/src/models/endpoints/HttpRequest';
import { IntermediaryService } from '@suite/services';
import { KeyboardService } from "../../../../../services/src/lib/keyboard/keyboard.service";
import { ToolbarProvider } from "../../../../../services/src/providers/toolbar/toolbar.provider";
import { Router } from "@angular/router";
import { ActionToolbarModel } from "../../../../../services/src/models/endpoints/ActionToolbar";
import { PopoverController, Platform } from "@ionic/angular";

@Component({
  selector: 'suite-scanner-rack',
  templateUrl: './scanner-rack.component.html',
  styleUrls: ['./scanner-rack.component.scss'],
})
export class ScannerRackComponent implements OnInit{

  @Input() showAlMenu: boolean = false;

  productReference: '';
  packageReference:'';
  referenceModel: '';
  sizeName: '';
  destinyWarehouse: any;
  inputValue: '';
  product:boolean= false;
  package:boolean = false;
  productId: number =0;
  public currentPage: string = 'Entrada';
  public optionsActions: ActionToolbarModel.ActionToolbar[] = [];
  color: string;
  isAndroid: boolean;
  state: boolean;
  showKeyboard: boolean;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private sorterInputService: SorterInputService,
    private intermediaryService: IntermediaryService,
    private keyboardService: KeyboardService,
    private router: Router,
    private popoverController: PopoverController,
    private toolbarProvider: ToolbarProvider,
    private plt: Platform
  ) {
    setTimeout(() => {
      document.getElementById('input').focus();
    },800); }

  @ViewChild('input') inputElement: IonInput;

  ngOnInit() {
    this.color = 'danger'
    if (this.plt.is('android')) {
      this.state = this.state = false
    }

    this.isAndroid = this.plt.is('android');

    this.toolbarProvider.currentPage.subscribe((page) => {
      this.currentPage = page;
      // muesta el boton del teclado en los titulos que tengan la ocurrencia "manual" en su cadena
      if (this.currentPage.includes('manual') || this.currentPage.includes('Manual') || this.currentPage.includes('Verificación de artículos') || this.currentPage.includes('Entrada') || this.currentPage.includes('Lista Control Embalajes') || this.currentPage.includes('Salida') || this.currentPage.includes('Control de embalajes')) {
        if(this.currentPage.includes('Código exposición manual') || this.currentPage.includes('Reetiquetado productos manual')){
          this.showKeyboard = false;
        } else {
          this.showKeyboard = true;
        }
      }
      else {
        this.showKeyboard = false
      }
    });
    this.toolbarProvider.showAlMenu.subscribe((show) => {
      this.showAlMenu = show;
    });
    this.toolbarProvider.optionsActions.subscribe((options) => {
      this.optionsActions = options;
      this.toolbarProvider.currentOptionsActions = options;
    });
    if(this.navParams.data.productScanned.uniqueCode){
      this.package = true;
      this.product = false;
      this.isPackage();
    }else{
      this.product = true;
      this.package = false;
      this.isProduct();
    }

    this.keyboardService.disabled();
    this.state = false;
    this.color = 'danger';
    this.focusToInput();
  }

  isProduct(){
    this.productReference = this.navParams.data.productScanned.reference;
    this.referenceModel = this.navParams.data.productScanned.model.reference;
    this.sizeName = this.navParams.data.productScanned.size.name;
    this.destinyWarehouse = this.navParams.data.productScanned.destinyWarehouse;
  }

  isPackage(){
    this.packageReference = this.navParams.data.productScanned.uniqueCode;
    this.productId = this.navParams.data.productScanned.product.id;
    this.referenceModel = this.navParams.data.productScanned.model.reference;
    this.destinyWarehouse = this.navParams.data.productScanned.destinyWarehouse;
  }

  focusToInput() {
    setTimeout(() => {
      if (document.getElementById('input')) {
        document.getElementById('input').focus()
      }
    }, 500);
  }

  async close(isClose = false) {
    await this.modalCtrl.dismiss({ productReference: this.productReference, close: isClose });
  }

  async keyUpInput(event) {
    const dataWrote = (this.inputValue || "").trim();
    if (event.keyCode === 13 && dataWrote) {
      await this.scanToRack()
    }
  }

  private scanToRack() {
    this.sorterInputService
      .postRackScan({ productReference: this.product == true ? this.productReference: this.packageReference, rackReference: this.inputValue })
      .subscribe(async (res: InputSorterModel.RackScan) => {
        await this.close()
      }, async (error: HttpRequestModel.Error) => {
        let errorMessage = 'Ha ocurrido un error al procesar la estantería escaneda.';
        if (error.error) {
          if (error.error.errors) {
            errorMessage = error.error.errors;
          } else if (error.error.statusCode === 404) {
            errorMessage = 'Estante Anexo incorrecto';
          } else if (error.error.statusCode === 405) {
            errorMessage = 'El Almacen del producto no coincide con la estanteria Anexa';
          }
        }
        await this.intermediaryService.presentToastError(errorMessage);
      });
  }

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

  hideByUrl(): boolean {
    return this.router.url == '/login';
  }

  onActiveKeyboard() {

    const state = this.keyboardService.isEneabled();
    this.state = state;
    if (state === true) {
      this.keyboardService.disabled();
      this.state = false;
      this.color = 'danger';
    } else {
      this.keyboardService.eneabled();
      this.state = true;
      this.color = 'success';
    }
  }
}
