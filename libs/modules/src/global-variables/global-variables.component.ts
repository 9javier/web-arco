import { Component, OnInit, ViewChild } from '@angular/core';
import {GlobalVariableService, GlobalVariableModel, IntermediaryService, JailModel} from '@suite/services';
import { FormBuilder } from '@angular/forms';
import {Events, ModalController} from "@ionic/angular";
import {UsersReplenishmentGlobalVarComponent} from "../global-variables/users-replenishment-global-var/users-replenishment-global-var.component";
import {EmployeeService} from "../../../services/src/lib/endpoint/employee/employee.service";
import EmployeeReplenishment = EmployeeModel.EmployeeReplenishment;
import {EmployeeModel} from "../../../services/src/models/endpoints/Employee";
import {MatPaginator} from "@angular/material";
import {PrinterService} from "../../../services/src/lib/printer/printer.service";
declare const BrowserPrint: any;

@Component({
  selector: 'suite-global-variables',
  templateUrl: './global-variables.component.html',
  styleUrls: ['./global-variables.component.scss']
})
export class GlobalVariablesComponent implements OnInit {

  listVariables: Array<GlobalVariableModel.GlobalVariable> = new Array<GlobalVariableModel.GlobalVariable>();
  private listTypesFromDb: Array<{ id: number, name: string, workwave: boolean, type: string, tooltip: string }> = [];
  private listVariablesFromDb: Array<GlobalVariableModel.GlobalVariable> = new Array<GlobalVariableModel.GlobalVariable>();
  private countLoadOfVariables: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  employees: EmployeeReplenishment[];
  filters: {
    name: string,
    replenishment: string,
    order: string
  };
  employeesToShow: any;

  constructor(
    private events: Events,
    private globalVariableService: GlobalVariableService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private employeeService: EmployeeService,
    private printerService: PrinterService,
  ) { }

  ngOnInit() {
    this.intermediaryService.presentLoading();

    this.getTypes();
    this.getGlobalVariables();
    this.filters = {
      name: '',
      replenishment: 'yes',
      order: 'ASC'
    };
    this.search();

    this.events.subscribe('load_of_variables', () => {
      this.countLoadOfVariables++;
      if (this.countLoadOfVariables == 2) {
        this.generateVariablesList();
        this.countLoadOfVariables = 0;
      }
    });
  }

  generateVariablesList() {
    this.intermediaryService.dismissLoading();
    if (this.listVariablesFromDb.length != this.listTypesFromDb.length) {
      this.listVariables = this.listVariablesFromDb;
      for (let iType in this.listTypesFromDb) {
        let type = this.listTypesFromDb[iType];
        let isTypeCreated: boolean = false;
        for (let iVariable in this.listVariablesFromDb) {
          let variable = this.listVariablesFromDb[iVariable];
          if (variable.type == type.id) {
            isTypeCreated = true;
            break;
          }
        }
        if (!isTypeCreated) {
          this.listVariables.push({ type: type.id, typeObject: type, value: null, tooltip: null });
        }
      }
    } else {
      this.listVariables = this.listVariablesFromDb;
    }
    this.listVariables.sort((a,b) => {
      if ( a && a.typeObject && b && b.typeObject && a.typeObject.type < b.typeObject.type ){
        return -1;
      }
      if ( a && a.typeObject && b && b.typeObject && a.typeObject.type > b.typeObject.type ){
        return 1;
      }
      if ( a && a.typeObject && b && b.typeObject && a.typeObject.name < b.typeObject.name ){
        return -1;
      }
      if ( a && a.typeObject && b && b.typeObject && a.typeObject.name > b.typeObject.name ){
        return 1;
      }
      return 0;
    });
  }

  getGlobalVariables() {
    this.globalVariableService
      .getAll()
      .subscribe((globalVariables) => {
        console.log("globalVariables",globalVariables);
        globalVariables.map(function(x){
          if(x.type == 4){
            x.value  = (parseInt(x.value)/60).toString();
          }
        });
        this.listVariablesFromDb = globalVariables;
        this.events.publish('load_of_variables');
      });
  }

  getTypes() {
    this.globalVariableService
      .getTypes()
      .subscribe((types) => {
        this.listTypesFromDb = types;
        this.events.publish('load_of_variables');
      });
  }

  getTypeById(id) : string {
    let type = this.listTypesFromDb.find((type) => {
      return type.id == id;
    });

    return type.name || '';
  }
  getGeneralTypeById(id) : string {
    let type = this.listTypesFromDb.find((type) => {
      return type.id == id;
    });

    return type.type || '';
  }
  getTooltipById(id) : string {
    let type = this.listTypesFromDb.find((type) => {
      return type.id == id;
    });

    return type.tooltip || '';
  }

  updateVariables() {
    let variablesToUpdate = this.listVariables.filter((variable, index) => {
      this.listVariables[index].error = !variable.value;
      return variable.value;
    });
    variablesToUpdate.map(function(x){
      if(x.type == 4){
        x.value  = (parseInt(x.value)*60).toString();
      }
    });
    if (variablesToUpdate.length == this.listVariables.length) {
      this.intermediaryService.presentLoading('Actualizando las variables...').then(() => {
        this.globalVariableService.store(variablesToUpdate).subscribe((res) => {
          this.search();
          this.getTypes();
          this.getGlobalVariables();
          this.intermediaryService.dismissLoading();
          this.intermediaryService.presentToastSuccess("Las variables han sido actualizadas.")
        },() => {
          this.intermediaryService.dismissLoading();
          this.intermediaryService.presentToastError("Actualización de variables fallida.");
        });
      });
    } else {
      this.intermediaryService.presentToastError('Inicialice todas las variables del sistema.');
    }
  }

  async usersReplenishment(){
    const modal = await this.modalController.create({component: UsersReplenishmentGlobalVarComponent});

    modal.onDidDismiss().then(async response => {
      if (response.data) {
        await this.intermediaryService.presentLoading('Cargando...');
        this.employeeService.store(response.data).then(async response => {
          if(response.code == 200){
            this.search();
            await this.intermediaryService.dismissLoading();
            await this.intermediaryService.presentToastSuccess('Los cambios se han guardado correctamente.');
          }else{
            console.error(response);
            await this.intermediaryService.dismissLoading();
          }
        }, async error => {
          console.error(error);
          await this.intermediaryService.dismissLoading();
        }).catch(async error => {
          console.error(error);
          await this.intermediaryService.dismissLoading();
        });
      }
    });

    await modal.present();
  }

  search(){
      const searchParameters = {
        name: this.filters.name,
        replenishment: this.filters.replenishment,
        pagination: {
          page: 1,
          limit: 10,
          sortType: this.filters.order
        }
      };
      this.employeeService.search(searchParameters).then(async response => {
        if(response.code == 200){
          this.employees = response.data[0];
          this.employeesToShow = this.employees.map( employee => {
            return employee.name;
          }).join(', ');
        }
      });
  }

  async sendZebraCommands(){
    await this.intermediaryService.presentLoading("Guardando configuración...",() => {
      console.log("BrowserPrint::sendZebraCommands");
      const commandsToSend = "! U1 setvar \"power.inactivity_timeout\" \"0\"\n" + "! U1 setvar \"power.low_battery_timeout\" \"0\"\"\n" +
        "! U1 setvar \"\"media.type\"\" \"\"label\"\"\n" + "! U1 setvar \"\"media.sense_mode\"\" \"\"gap\"\"\n" + "~jc^xa^jus^xz";
      if(BrowserPrint){
        BrowserPrint.getDefaultDevice("printer", (device) => {
          console.log("BrowserPrint::device", device);
          if(device){
            console.log("BrowserPrint::send", commandsToSend)
            device.send(commandsToSend, (data) => {
              console.log("BrowserPrint::data", data);
              this.intermediaryService.dismissLoading();
            }, (e) => {
              this.intermediaryService.dismissLoading();
              console.log("BrowserPrint::Error send", e);
              this.intermediaryService.presentToastError('Error enviando datos a la impresora');
            });
          } else {
            this.intermediaryService.dismissLoading();
            this.intermediaryService.presentToastError('No hay impresora por defecto de Browser Print');
          }
        }, (error) => {
          this.intermediaryService.dismissLoading();
          console.log("BrowserPrint::Error send", error);
          this.intermediaryService.presentToastError('Error enviando datos a la impresora');
        });
      } else {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError('Browser Print no instalado');
        console.log("BrowserPrint not installed")
      }
    });
  }

}
