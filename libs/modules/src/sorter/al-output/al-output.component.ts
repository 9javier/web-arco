import {Component, OnDestroy, OnInit} from '@angular/core';
import {SorterProvider} from "../../../../services/src/providers/sorter/sorter.provider";
import {Router} from "@angular/router";
import {IntermediaryService} from "@suite/services";
import {TemplateColorsModel} from "../../../../services/src/models/endpoints/TemplateColors";
import {SorterModel} from "../../../../services/src/models/endpoints/Sorter";
import {HttpRequestModel} from "../../../../services/src/models/endpoints/HttpRequest";
import {ExecutionSorterModel} from "../../../../services/src/models/endpoints/ExecutionSorter";
import {SorterExecutionService} from "../../../../services/src/lib/endpoint/sorter-execution/sorter-execution.service";
import {SorterService} from "../../../../services/src/lib/endpoint/sorter/sorter.service";
import {TemplateColorsService} from "../../../../services/src/lib/endpoint/template-colors/template-colors.service";
import {TemplateSorterModel} from "../../../../services/src/models/endpoints/TemplateSorter";

@Component({
  selector: 'sorter-output-al',
  templateUrl: './al-output.component.html',
  styleUrls: ['./al-output.component.scss']
})
export class AlOutputSorterComponent implements OnInit, OnDestroy {

  private activeDefaultData: boolean = false;

  public colorsSelectors: TemplateColorsModel.AvailableColorsByProcess[] = [];
  public loadingSorterTemplateMatrix: boolean = true;

  constructor(
    private router: Router,
    private intermediaryService: IntermediaryService,
    private sorterExecutionService: SorterExecutionService,
    private sorterService: SorterService,
    private templateColorsService: TemplateColorsService,
    public sorterProvider: SorterProvider
  ) { }
  
  ngOnInit() {
    if (this.activeDefaultData) {
      this.loadDefaultData();
    } else {
      this.loadingSorterTemplateMatrix = true;
      this.loadData();
    }
  }

  ngOnDestroy() {
    this.stopExecutionColor(false);
  }

  private loadDefaultData() {
    // loadActiveSorter
    let resFirstSorter = {
      "createdAt": "2019-10-10T11:20:24.000Z",
      "updatedAt": "2019-10-10T11:20:24.000Z",
      "id": 1,
      "name": "Main Sorter",
      "ways": 21,
      "columns": 3,
      "heights": 7,
      "active": true,
      "sorterWays": [
        {
          "createdAt": "2019-10-10T11:20:24.000Z",
          "updatedAt": "2019-10-10T11:20:24.000Z",
          "id": 1,
          "name": "Main Sorter",
          "number": 1,
          "active": true,
          "column": 1,
          "height": 1,
          "inCanId": 1,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:25.000Z",
          "updatedAt": "2019-10-10T11:20:25.000Z",
          "id": 2,
          "name": "Main Sorter",
          "number": 2,
          "active": true,
          "column": 2,
          "height": 1,
          "inCanId": 2,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:25.000Z",
          "updatedAt": "2019-10-10T11:20:25.000Z",
          "id": 3,
          "name": "Main Sorter",
          "number": 3,
          "active": true,
          "column": 3,
          "height": 1,
          "inCanId": 3,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:25.000Z",
          "updatedAt": "2019-10-10T11:20:25.000Z",
          "id": 4,
          "name": "Main Sorter",
          "number": 4,
          "active": true,
          "column": 1,
          "height": 2,
          "inCanId": 4,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:25.000Z",
          "updatedAt": "2019-10-10T11:20:25.000Z",
          "id": 5,
          "name": "Main Sorter",
          "number": 5,
          "active": true,
          "column": 2,
          "height": 2,
          "inCanId": 5,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:25.000Z",
          "updatedAt": "2019-10-10T11:20:25.000Z",
          "id": 6,
          "name": "Main Sorter",
          "number": 6,
          "active": true,
          "column": 3,
          "height": 2,
          "inCanId": 6,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:25.000Z",
          "updatedAt": "2019-10-10T11:20:25.000Z",
          "id": 7,
          "name": "Main Sorter",
          "number": 7,
          "active": true,
          "column": 1,
          "height": 3,
          "inCanId": 7,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 8,
          "name": "Main Sorter",
          "number": 8,
          "active": true,
          "column": 2,
          "height": 3,
          "inCanId": 8,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 9,
          "name": "Main Sorter",
          "number": 9,
          "active": true,
          "column": 3,
          "height": 3,
          "inCanId": 9,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 10,
          "name": "Main Sorter",
          "number": 10,
          "active": true,
          "column": 1,
          "height": 4,
          "inCanId": 10,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 11,
          "name": "Main Sorter",
          "number": 11,
          "active": true,
          "column": 2,
          "height": 4,
          "inCanId": 11,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 12,
          "name": "Main Sorter",
          "number": 12,
          "active": true,
          "column": 3,
          "height": 4,
          "inCanId": 12,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 13,
          "name": "Main Sorter",
          "number": 13,
          "active": true,
          "column": 1,
          "height": 5,
          "inCanId": 13,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 14,
          "name": "Main Sorter",
          "number": 14,
          "active": true,
          "column": 2,
          "height": 5,
          "inCanId": 14,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 15,
          "name": "Main Sorter",
          "number": 15,
          "active": true,
          "column": 3,
          "height": 5,
          "inCanId": 15,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 16,
          "name": "Main Sorter",
          "number": 16,
          "active": true,
          "column": 1,
          "height": 6,
          "inCanId": 16,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 17,
          "name": "Main Sorter",
          "number": 17,
          "active": true,
          "column": 2,
          "height": 6,
          "inCanId": 17,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 18,
          "name": "Main Sorter",
          "number": 18,
          "active": true,
          "column": 3,
          "height": 6,
          "inCanId": 18,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:26.000Z",
          "updatedAt": "2019-10-10T11:20:26.000Z",
          "id": 19,
          "name": "Main Sorter",
          "number": 19,
          "active": true,
          "column": 1,
          "height": 7,
          "inCanId": 19,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:27.000Z",
          "updatedAt": "2019-10-10T11:20:27.000Z",
          "id": 20,
          "name": "Main Sorter",
          "number": 20,
          "active": true,
          "column": 2,
          "height": 7,
          "inCanId": 20,
          "outCanId": 0
        }, {
          "createdAt": "2019-10-10T11:20:27.000Z",
          "updatedAt": "2019-10-10T11:20:27.000Z",
          "id": 21,
          "name": "Main Sorter",
          "number": 21,
          "active": true,
          "column": 3,
          "height": 7,
          "inCanId": 21,
          "outCanId": 0
        }],
      "colors": [
        {
          "createdAt": "2019-10-10T11:22:39.000Z",
          "updatedAt": "2019-10-10T11:22:39.000Z",
          "id": 1,
          "sorter": {
            "createdAt": "2019-10-10T11:20:24.000Z",
            "updatedAt": "2019-10-10T11:20:24.000Z",
            "id": 1,
            "name": "Main Sorter",
            "ways": 21,
            "columns": 3,
            "heights": 7,
            "active": true
          },
          "sorterZonesColor": {
            "createdAt": "2019-10-10T11:21:29.000Z",
            "updatedAt": "2019-10-10T11:21:29.000Z",
            "id": 1,
            "name": "Purple",
            "hex": "#b388ff"
          }
        }, {
          "createdAt": "2019-10-10T11:22:42.000Z",
          "updatedAt": "2019-10-10T11:22:42.000Z",
          "id": 2,
          "sorter": {
            "createdAt": "2019-10-10T11:20:24.000Z",
            "updatedAt": "2019-10-10T11:20:24.000Z",
            "id": 1,
            "name": "Main Sorter",
            "ways": 21,
            "columns": 3,
            "heights": 7,
            "active": true
          },
          "sorterZonesColor": {
            "createdAt": "2019-10-10T11:21:34.000Z",
            "updatedAt": "2019-10-10T11:21:34.000Z",
            "id": 2,
            "name": "Green",
            "hex": "#ccff90"
          }
        }, {
          "createdAt": "2019-10-10T11:22:44.000Z",
          "updatedAt": "2019-10-10T11:22:44.000Z",
          "id": 3,
          "sorter": {
            "createdAt": "2019-10-10T11:20:24.000Z",
            "updatedAt": "2019-10-10T11:20:24.000Z",
            "id": 1,
            "name": "Main Sorter",
            "ways": 21,
            "columns": 3,
            "heights": 7,
            "active": true
          },
          "sorterZonesColor": {
            "createdAt": "2019-10-10T11:21:42.000Z",
            "updatedAt": "2019-10-10T11:21:42.000Z",
            "id": 3,
            "name": "Orange",
            "hex": "#ff9e80"
          }
        }, {
          "createdAt": "2019-10-10T11:22:45.000Z",
          "updatedAt": "2019-10-10T11:22:45.000Z",
          "id": 4,
          "sorter": {
            "createdAt": "2019-10-10T11:20:24.000Z",
            "updatedAt": "2019-10-10T11:20:24.000Z",
            "id": 1,
            "name": "Main Sorter",
            "ways": 21,
            "columns": 3,
            "heights": 7,
            "active": true
          },
          "sorterZonesColor": {
            "createdAt": "2019-10-10T11:21:49.000Z",
            "updatedAt": "2019-10-10T11:21:49.000Z",
            "id": 4,
            "name": "Pink",
            "hex": "#ea80fc"
          }
        }, {
          "createdAt": "2019-10-10T11:22:47.000Z",
          "updatedAt": "2019-10-10T11:22:47.000Z",
          "id": 5,
          "sorter": {
            "createdAt": "2019-10-10T11:20:24.000Z",
            "updatedAt": "2019-10-10T11:20:24.000Z",
            "id": 1,
            "name": "Main Sorter",
            "ways": 21,
            "columns": 3,
            "heights": 7,
            "active": true
          },
          "sorterZonesColor": {
            "createdAt": "2019-10-10T11:21:57.000Z",
            "updatedAt": "2019-10-10T11:21:57.000Z",
            "id": 5,
            "name": "Cian",
            "hex": "#a7ffeb"
          }
        }, {
          "createdAt": "2019-10-10T11:22:49.000Z",
          "updatedAt": "2019-10-10T11:22:49.000Z",
          "id": 6,
          "sorter": {
            "createdAt": "2019-10-10T11:20:24.000Z",
            "updatedAt": "2019-10-10T11:20:24.000Z",
            "id": 1,
            "name": "Main Sorter",
            "ways": 21,
            "columns": 3,
            "heights": 7,
            "active": true
          },
          "sorterZonesColor": {
            "createdAt": "2019-10-10T11:22:05.000Z",
            "updatedAt": "2019-10-10T11:22:05.000Z",
            "id": 6,
            "name": "Brown",
            "hex": "#ffd180"
          }
        }, {
          "createdAt": "2019-10-10T11:22:51.000Z",
          "updatedAt": "2019-10-10T11:22:51.000Z",
          "id": 7,
          "sorter": {
            "createdAt": "2019-10-10T11:20:24.000Z",
            "updatedAt": "2019-10-10T11:20:24.000Z",
            "id": 1,
            "name": "Main Sorter",
            "ways": 21,
            "columns": 3,
            "heights": 7,
            "active": true
          },
          "sorterZonesColor": {
            "createdAt": "2019-10-10T11:22:12.000Z",
            "updatedAt": "2019-10-10T11:22:12.000Z",
            "id": 7,
            "name": "Blue",
            "hex": "#82b1ff"
          }
        }, {
          "createdAt": "2019-10-10T11:22:53.000Z",
          "updatedAt": "2019-10-10T11:22:53.000Z",
          "id": 8,
          "sorter": {
            "createdAt": "2019-10-10T11:20:24.000Z",
            "updatedAt": "2019-10-10T11:20:24.000Z",
            "id": 1,
            "name": "Main Sorter",
            "ways": 21,
            "columns": 3,
            "heights": 7,
            "active": true
          },
          "sorterZonesColor": {
            "createdAt": "2019-10-10T11:22:19.000Z",
            "updatedAt": "2019-10-10T11:22:19.000Z",
            "id": 8,
            "name": "Yellow",
            "hex": "#ffe57f"
          }
        }],
      "warehouse": {
        "id": 1,
        "name": "VIRTUAL (SUPERFERIA)",
        "description": "VIRTUAL (SUPERFERIA)",
        "reference": "001",
        "is_store": true,
        "is_main": false,
        "has_racks": true,
        "is_outlet": false,
        "prefix_container": "V",
        "packingType": 1
      }
    };
    let sorterId = resFirstSorter.id;

    // checkActiveColor
    let resActiveColor = {
      "statusCode": 201,
      "statusMessage": "Created",
      "statusDescription": "Resource created",
      "result": {},
      "data": {
        "createdAt": "2019-10-18T07:02:32.000Z",
        "updatedAt": "2019-10-18T07:02:32.000Z",
        "id": 19,
        "type": 1,
        "process": 1,
        "color": {
          "createdAt": "2019-10-14T10:26:10.000Z",
          "updatedAt": "2019-10-14T10:26:10.000Z",
          "id": 4,
          "name": "Azul",
          "ref": 0,
          "hex": "#0000ff"
        },
        "execution": {
          "createdAt": "2019-10-14T11:59:36.000Z",
          "updatedAt": "2019-10-14T11:59:36.000Z",
          "id": 4,
          "status": 1
        },
        "template": {
          "createdAt": "2019-10-10T11:23:21.000Z",
          "updatedAt": "2019-10-10T11:23:21.000Z",
          "id": 2,
          "name": "Not Equals 1",
          "active": true,
          "equalParts": false
        },
        "zone": null
      },
      "message": "User Color Active retrieved",
      "code": 201
    };
    this.sorterProvider.colorActiveForUser = resActiveColor.data.color.hex;
    this.sorterProvider.processActiveForUser = 1;

    // loadAvailableColors
    this.colorsSelectors = [
      {"createdAt":"2019-10-14T10:25:31.000Z","updatedAt":"2019-10-14T10:25:31.000Z","id":1,"name":"Rojo","hex":"#ff0000","available":"1"},{"createdAt":"2019-10-14T10:25:44.000Z","updatedAt":"2019-10-14T10:25:44.000Z","id":2,"name":"Amarillo","hex":"#ffff00","available":"1"},{"createdAt":"2019-10-14T10:25:53.000Z","updatedAt":"2019-10-14T10:25:53.000Z","id":3,"name":"Verde","hex":"#00ff00","available":"1"},{"createdAt":"2019-10-14T10:26:10.000Z","updatedAt":"2019-10-14T10:26:10.000Z","id":4,"name":"Azul","hex":"#0000ff","available":"0"}
      ];

    // loadActiveTemplate
    let resActiveTemplate = {"createdAt":"2019-10-10T11:23:21.000Z","updatedAt":"2019-10-10T11:23:21.000Z","id":2,"name":"Not Equals 1","active":true,"equalParts":false,"executions":[{"createdAt":"2019-10-14T11:59:36.000Z","updatedAt":"2019-10-14T11:59:36.000Z","id":4,"status":1}]};
    let templateId = resActiveTemplate.id;
  }

  private loadData() {
    this.loadActiveSorter();
    this.checkActiveColor();
  }

  colorSelected(data) {
    this.sorterProvider.colorSelected = data;
  }

  sorterOperationCancelled() {
    this.sorterProvider.colorSelected = null;
  }

  async sorterOperationStarted() {
    if (!this.sorterProvider.colorSelected) {
      await this.intermediaryService.presentToastError('Selecciona un color para comenzar.');
      return;
    }

    await this.intermediaryService.presentLoading('Iniciando proceso...');

    let paramsRequest: ExecutionSorterModel.ParamsExecuteColor = {
      color: this.sorterProvider.colorSelected.id,
      type: 2
    };

    this.sorterExecutionService
      .postExecuteColor(paramsRequest)
      .subscribe(async (res: ExecutionSorterModel.ExecuteColor) => {
        // TODO Request to New Process Way to get way and warehouse to use
        this.sorterProvider.infoSorterOutputOperation = {
          destinyWarehouse: {
            id: 1,
            name: 'KRACK OUTLET (CULLEREDO)',
            reference: '601'
          },
          wayId: 37
        };
        await this.intermediaryService.presentToastSuccess(`Comenzando proceso en el sorter con el color ${this.sorterProvider.colorSelected.name}`);
        this.sorterProvider.colorActiveForUser = this.sorterProvider.colorSelected.hex;
        this.sorterProvider.processActiveForUser = 2;
        this.router.navigate(['sorter/output/scanner']);
        await this.intermediaryService.dismissLoading();
      }, async (error: HttpRequestModel.Error) => {
        let errorMessage = `Ha ocurrido un error al intentar iniciar el proceso con el color ${this.sorterProvider.colorSelected.name}`;
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
      });
  }

  actionLaunched() {
    this.intermediaryService.presentConfirm(
      'Va a finalizar el proceso activo actualmente para el usuario. <br/>¿Está seguro de querer hacerlo?',
      () => this.stopExecutionColor(true)
    );
  }

  getMessageForNotificationActiveProcess() : string {
    if (this.sorterProvider.colorActiveForUser && this.sorterProvider.processActiveForUser == 1) {
      return 'el usuario ya tiene un proceso de entrada iniciado';
    } else if (this.sorterProvider.colorActiveForUser && this.sorterProvider.processActiveForUser == 2) {
      return 'el usuario ya tiene un proceso iniciado';
    } else {
      return '';
    }
  }

  //region Endpoints requests
  private loadActiveSorter() {
    this.sorterService
      .getFirstSorter()
      .subscribe((res: SorterModel.FirstSorter) => {
        this.loadAvailableColors();
      }, async (error: HttpRequestModel.Error) => {
        let errorMessage = 'Ha ocurrido un error al intentar cargar los datos del sorter.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        this.loadingSorterTemplateMatrix = false;
      });
  }

  private checkActiveColor() {
    this.sorterExecutionService
      .getColorActive()
      .then((res: ExecutionSorterModel.ResponseColorActive) => {
        if (res.code == 201) {
          this.sorterProvider.colorActiveForUser = res.data.color.hex;
          this.sorterProvider.processActiveForUser = res.data.process;
        } else {
          this.sorterProvider.colorActiveForUser = null;
          this.sorterProvider.processActiveForUser = null;
        }
      }, async (error) => {
        console.error('Error::Rejected::sorterExecutionService::getColorActive', error);
        this.sorterProvider.colorActiveForUser = null;
        this.sorterProvider.processActiveForUser = null;
      })
      .catch(async (error) => {
        console.error('Error::Catch::sorterExecutionService::getColorActive', error);
        this.sorterProvider.colorActiveForUser = null;
        this.sorterProvider.processActiveForUser = null;
      });
  }

  private loadAvailableColors() {
    this.templateColorsService
      .postAvailableColorsByProcess({ processType: 2 })
      .subscribe((res: TemplateColorsModel.AvailableColorsByProcess[]) => {
        this.colorsSelectors = res;
      }, async (error: HttpRequestModel.Error) => {
        let errorMessage = 'Ha ocurrido un error al intentar cargar los datos del sorter.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        this.loadingSorterTemplateMatrix = false;
      });
  }

  private async stopExecutionColor(waitingResponse: boolean) {
    if (waitingResponse) {
      await this.intermediaryService.presentLoading('Finalizando proceso actual...');
    }
    this.sorterExecutionService
      .postStopExecuteColor()
      .subscribe(async (res: ExecutionSorterModel.StopExecuteColor) => {
        this.sorterProvider.colorActiveForUser = null;
        this.sorterProvider.processActiveForUser = null;
        if (waitingResponse) {
          await this.intermediaryService.dismissLoading();
          await this.intermediaryService.presentToastSuccess('Proceso finalizado', 1500);
          this.loadingSorterTemplateMatrix = true;
          this.loadData();
          this.sorterOperationCancelled();
        }
      }, async (error: HttpRequestModel.Error) => {
        if (waitingResponse) {
          let errorMessage = 'Ha ocurrido un error al intentar finalizar la ejecución actual del sorter par el usuario.';
          if (error.error && error.error.errors) {
            errorMessage = error.error.errors;
          }await this.intermediaryService.presentToastError(errorMessage);
        }
      });
  }
  //endregion
}
