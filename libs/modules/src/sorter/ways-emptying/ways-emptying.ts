import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

  private firstSorter: SorterModel.FirstSorter;
  private lastWaySelected = null;
  private waysToUpdate: any[] = [];

  constructor(
    private sorterService: SorterService,
    private sorterTemplateService: SorterTemplateService,
    private templateZonesService: TemplateZonesService,
    private sorterOutputService: SorterOutputService,
    private intermediaryService: IntermediaryService
  ) { }

  ngOnInit() {
    this.loadActiveSorter();
  }

  ngOnDestroy() {

  }

  public columnSelected(data: {column: MatrixSorterModel.Column, iHeight: number, iCol: number}) {
    this.disableAuto = true;
    this.disableManual = true;
    if (data.column.way.new_emptying == null) {
      if (data.column.way.manual == 1) {
        this.disableAuto = false;
      } else {
        this.disableManual = false;
      }
    } else {
      if (data.column.way.new_emptying == 1) {
        this.disableAuto = false;
      } else {
        this.disableManual = false;
      }
    }
    this.lastWaySelected = data;
    this.infoWayEmptying.newWaySelected(data.column.way);
  }

  public autoEmptying() {
    this.matrix.changeEmptyingForWay(0, this.lastWaySelected.iHeight, this.lastWaySelected.iCol);
    this.disableAuto = true;
    this.disableManual = false;
    let someWay = this.waysToUpdate.findIndex(wayToUpdate => wayToUpdate.id == this.lastWaySelected.column.way.id);
    if (someWay >= 0) {
      this.waysToUpdate[someWay] = this.lastWaySelected.column.way;
      this.waysToUpdate[someWay].new_emptying = 0;
    } else {
      let wayToUpdate = this.lastWaySelected.column.way;
      wayToUpdate.new_emptying = 0;
      this.waysToUpdate.push(wayToUpdate);
    }
  }

  public manualEmptying() {
    this.matrix.changeEmptyingForWay(1, this.lastWaySelected.iHeight, this.lastWaySelected.iCol);
    this.disableAuto = false;
    this.disableManual = true;
    let someWay = this.waysToUpdate.findIndex(wayToUpdate => wayToUpdate.id == this.lastWaySelected.column.way.id);
    if (someWay >= 0) {
      this.waysToUpdate[someWay] = this.lastWaySelected.column.way;
      this.waysToUpdate[someWay].new_emptying = 1;
    } else {
      let wayToUpdate = this.lastWaySelected.column.way;
      wayToUpdate.new_emptying = 1;
      this.waysToUpdate.push(wayToUpdate);
    }
  }

  public async saveChanges() {
    await this.intermediaryService.presentLoading('Guardando cambios...');
    let waysToUpdate = this.waysToUpdate.filter(wayToUpdate => wayToUpdate.manual != wayToUpdate.new_emptying);
    if (waysToUpdate.length > 0) {
      let paramsChangeWayManual = waysToUpdate.map(wayToUpdate => {
        return {
          wayId: wayToUpdate.id,
          manual: !!wayToUpdate.new_emptying
        }
      });
      this.sorterOutputService
        .postChangeWayManual({ ways: paramsChangeWayManual })
        .then(async (res: SorterOutputModel.ResponseChangeWayManual) => {
          if (res.code == 200) {
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
  }

  private loadActiveSorter() {
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
