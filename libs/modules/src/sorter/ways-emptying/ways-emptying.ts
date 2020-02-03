import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {SorterService} from "../../../../services/src/lib/endpoint/sorter/sorter.service";
import {TemplateZonesService} from "../../../../services/src/lib/endpoint/template-zones/template-zones.service";
import {SorterModel} from "../../../../services/src/models/endpoints/Sorter";
import {TemplateSorterModel} from "../../../../services/src/models/endpoints/TemplateSorter";
import {HttpRequestModel} from "../../../../services/src/models/endpoints/HttpRequest";
import {SorterTemplateService} from "../../../../services/src/lib/endpoint/sorter-template/sorter-template.service";
import {IntermediaryService} from "@suite/services";
import {MatrixEmptyingSorterComponent} from "./matrix/matrix.component";
import {MatrixSorterModel} from "../../../../services/src/models/endpoints/MatrixSorter";
import {SorterInfoWayEmptyingComponent} from "./info-way/info-way.component";
import {SorterOutputService} from "../../../../services/src/lib/endpoint/sorter-output/sorter-output.service";
import {SorterOutputModel} from "../../../../services/src/models/endpoints/SorterOutput";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'suite-sorter-ways-emptying',
  templateUrl: './ways-emptying.html',
  styleUrls: ['./ways-emptying.scss']
})
export class WaysEmptyingComponent implements OnInit, OnDestroy {

  @ViewChild(MatrixEmptyingSorterComponent) matrix: MatrixEmptyingSorterComponent;
  @ViewChild(SorterInfoWayEmptyingComponent) infoWayEmptying: SorterInfoWayEmptyingComponent;

  public waysMatrix = [];
  public isTemplateWithEqualZones: boolean = false;
  public loadingSorterTemplateMatrix: boolean = true;
  public disableAuto: boolean = true;
  public disableManual: boolean = true;
  public disableMixed: boolean = true;
  public disableFullSelect :boolean = true;

  public listOfIdsWays:number[];

  private firstSorter: SorterModel.FirstSorter;
  private lastWaySelected = null;
  private lastWaysSelected: any[] = [];
  private waysToUpdate: any[] = [];




  constructor(
    private sorterService: SorterService,
    private sorterTemplateService: SorterTemplateService,
    private templateZonesService: TemplateZonesService,
    private sorterOutputService: SorterOutputService,
    private intermediaryService: IntermediaryService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    console.log('passa per ways');
    this.loadActiveSorter();
  }

  ngOnDestroy() {

  }

  public columnSelected(data: {column: MatrixSorterModel.Column, iHeight: number, iCol: number}) {

    this.disableAuto = true;
    this.disableManual = true;
    this.disableMixed = true;
    // console.log({data});
    this.lastWaySelected = data;
    let flag = false;
    let wayS = null;
    for(wayS of this.lastWaysSelected){
      if(wayS.column.way.id === this.lastWaySelected.column.way.id){
        flag = true;
        this.removeItemFromArr( this.lastWaysSelected, wayS );
      }
    }
    if(flag === false) {
      this.lastWaysSelected.push(this.lastWaySelected);
    }
    this.emptyingVerification();
    this.infoWayEmptying.newWaySelected(data.column.way);
  }

  removeItemFromArr( arr, item ) {
    let i = arr.indexOf( item );

    if ( i !== -1 ) {
      arr.splice( i, 1 );
    }
  }

  emptyingVerification(){
    let way = null;
    let haveManual = false;
    let haveAuto = false;
    if(this.lastWaysSelected.length === 0){
      this.disableAuto = true;
      this.disableManual = true;
      this.disableMixed = true;
    }else{
      for(way of this.lastWaysSelected){
        if( way.column.way.manual === 1){
          haveManual = true;
        }else{
          if(way.column.way.manual === 0){
            haveAuto = true;
          }
        }
      }
      if(haveManual === true && haveAuto === true){
        this.disableAuto = true;
        this.disableManual = true;
        this.disableMixed = false;
      }else{
        if(haveManual === true){
          this.disableAuto = false;
          this.disableManual = true;
          this.disableMixed = true;
        }else{
          this.disableAuto = true;
          this.disableManual = false;
          this.disableMixed = true;
          this.disableFullSelect = false;
        }
      }
    }
  }

   public async creatAler(){
    let a = await this.alertController.create({
      header:'¡Están seguros de vaciar las calles!',
      message: 'Vaciaremos las calles selecionadas',
      buttons:[
        {
          text:'Ok',
          handler: async ()=>{
            console.log('passa por ok');
            await this.allEmptying();
          }
        },
        {
          text:'NO',
          handler:()=>{
            console.log('passa por no');
            // a.dismiss();
          }
        }
      ]
    });

    await a.present();
  }

  /**
   * @description new Methos for all list
   * @author Gaetano Sabino
   */
  private async allEmptying(){

    if(this.listOfIdsWays.length > 0){
    console.log(this.listOfIdsWays);
    //  TODO call of method for delete all ways
    await this.intermediaryService.presentLoading('Vacciando Calles...');
    let result  = await this.sorterOutputService.postEmptyAllWays(
      {waysId:this.listOfIdsWays}
    );
    if(result.code === 200){
      this.listOfIdsWays = [];
      this.disableManual = true;
      this.disableMixed = true;
      await this.intermediaryService.dismissLoading();
      this.matrix.borrarWays();
      // await this.manualEmptying();

      return;
    }else {
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastError('Error en vaciar las Calle/s');

    }
    }else {
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastError('Error en vaciar las Calle/s');
      return;
    }
  }

  public async autoEmptying() {
    await this.intermediaryService.presentLoading('Cambiando a vaciado automático...');
    let selectedWay = null;
    for(selectedWay of this.lastWaysSelected) {
      this.matrix.changeEmptyingForWay(0, selectedWay.iHeight, selectedWay.iCol);
      this.disableAuto = true;
      this.disableManual = true;
      let someWay = this.waysToUpdate.findIndex(wayToUpdate => wayToUpdate.id === selectedWay.column.way.id);
      if (someWay >= 0) {
        this.waysToUpdate[someWay] = selectedWay.column.way;
        this.waysToUpdate[someWay].new_emptying = 0;
      } else {
        let wayToUpdate = selectedWay.column.way;
        wayToUpdate.new_emptying = 0;
        this.waysToUpdate.push(wayToUpdate);
      }
    }
    await this.changeWayManual();

  }

  public async manualEmptying() {
    await this.intermediaryService.presentLoading('Cambiando a vaciado manual...');
    let selectedWay = null;
    for(selectedWay of this.lastWaysSelected) {
      this.matrix.changeEmptyingForWay(1, selectedWay.iHeight, selectedWay.iCol);
      this.disableAuto = true;
      this.disableManual = true;
      let someWay = this.waysToUpdate.findIndex(wayToUpdate => wayToUpdate.id === selectedWay.column.way.id);
      if (someWay >= 0) {
        this.waysToUpdate[someWay] = selectedWay.column.way;
        this.waysToUpdate[someWay].new_emptying = 1;
      } else {
        let wayToUpdate = selectedWay.column.way;
        wayToUpdate.new_emptying = 1;
        this.waysToUpdate.push(wayToUpdate);
      }
    }
    await this.changeWayManual();

  }

  public async mixedEmptying() {
    await this.intermediaryService.presentLoading('Invirtiendo tipo de vaciado...');
    let selectedWay = null;
    for(selectedWay of this.lastWaysSelected) {
      if(selectedWay.column.way.manual === 1){
        this.matrix.changeEmptyingForWay(0, selectedWay.iHeight, selectedWay.iCol);
        this.disableAuto = true;
        this.disableManual = true;
        this.disableMixed = true;
        let someWay = this.waysToUpdate.findIndex(wayToUpdate => wayToUpdate.id === selectedWay.column.way.id);
        if (someWay >= 0) {
          this.waysToUpdate[someWay] = selectedWay.column.way;
          this.waysToUpdate[someWay].new_emptying = 0;
        } else {
          let wayToUpdate = selectedWay.column.way;
          wayToUpdate.new_emptying = 0;
          this.waysToUpdate.push(wayToUpdate);
        }
      }else{
        this.matrix.changeEmptyingForWay(1, selectedWay.iHeight, selectedWay.iCol);
        this.disableAuto = true;
        this.disableManual = true;
        this.disableMixed = true;
        let someWay = this.waysToUpdate.findIndex(wayToUpdate => wayToUpdate.id === selectedWay.column.way.id);
        if (someWay >= 0) {
          this.waysToUpdate[someWay] = selectedWay.column.way;
          this.waysToUpdate[someWay].new_emptying = 1;
        } else {
          let wayToUpdate = selectedWay.column.way;
          wayToUpdate.new_emptying = 1;
          this.waysToUpdate.push(wayToUpdate);
        }
      }
    }
    await this.changeWayManual();

  }

  private async changeWayManual() {
    let waysToUpdate = this.waysToUpdate.filter(wayToUpdate => wayToUpdate.manual !== wayToUpdate.new_emptying);

    let paramsChangeWayManual = waysToUpdate.map(wayToUpdate => {
      return {
        wayId: wayToUpdate.id,
        manual: !!wayToUpdate.new_emptying
      }
    });
    this.sorterOutputService
      .postChangeWayManual({ ways: paramsChangeWayManual })
      .then(async (res: SorterOutputModel.ResponseChangeWayManual) => {
        if (res.code === 200) {
          for (let way of paramsChangeWayManual) {
            let wayToUpdateFound = this.waysToUpdate.find(wayToUpdate => wayToUpdate.id === way.wayId);
            if (wayToUpdateFound) {
              wayToUpdateFound.manual = (way.manual ? 1 : 0);
            }
          }
          this.lastWaysSelected = [];
          this.waysToUpdate = [];
          this.matrix.refresh();
          await this.intermediaryService.presentToastSuccess('¡Cambios guardados!');
          await this.intermediaryService.dismissLoading();
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar guardar los cambios.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
        }
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar guardar los cambios.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
      })
      .catch(async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar guardar los cambios.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
      });
  }

  public loadActiveSorter() {
    this.waysMatrix = [];
    this.isTemplateWithEqualZones = false;
    this.loadingSorterTemplateMatrix = true;
    this.disableAuto = true;
    this.disableManual = true;
    this.disableMixed = true;

    this.firstSorter = null;
    this.lastWaySelected = null;
    this.lastWaysSelected = [];
    this.waysToUpdate = [];
    this.sorterService
      .getFirstSorter()
      .subscribe(data => {
        this.firstSorter = data;
        this.loadActiveTemplate(data.id);
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar cargar los datos del sorter.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        this.loadingSorterTemplateMatrix = false;
      });
  }

  private loadActiveTemplate(idSorter: number) {
    this.sorterTemplateService
      .getActiveTemplate()
      .subscribe((res: TemplateSorterModel.Template) => {
        this.isTemplateWithEqualZones = res.equalParts;
        this.loadMatrixTemplateSorter(idSorter, res.id);
      }, async (error: HttpRequestModel.Error) => {
        let errorMessage = 'Ha ocurrido un error al intentar cargar la plantilla actual del sorter.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        this.loadingSorterTemplateMatrix = false;
      });
  }

  private loadMatrixTemplateSorter(idSorter: number, idTemplate: number) {
    this.templateZonesService
      .getMatrixByTemplate(idSorter, idTemplate)
      .subscribe((data) => {
        this.waysMatrix = data.data;
        this.matrix.loadNewMatrix(this.waysMatrix);
        this.matrix.refresh();
        this.infoWayEmptying.ngOnInit();
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar cargar la plantilla actual del sorter.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        this.loadingSorterTemplateMatrix = false;
      });
  }
}
