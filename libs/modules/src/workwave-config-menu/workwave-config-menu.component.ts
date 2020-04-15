import { Component, OnInit } from '@angular/core';
import { GlobalVariableService, GlobalVariableModel, IntermediaryService } from '@suite/services';
import { FormBuilder } from '@angular/forms';
import {Events} from "@ionic/angular";

@Component({
  selector: 'suite-workwave-config-menu',
  templateUrl: './workwave-config-menu.component.html',
  styleUrls: ['./workwave-config-menu.component.scss']
})
export class WorkwaveConfigMenuComponent implements OnInit {

  listVariables: Array<GlobalVariableModel.GlobalVariable> = new Array<GlobalVariableModel.GlobalVariable>();
  private listTypesFromDb: Array<{ id: number, name: string }> = [];
  private listVariablesFromDb: Array<GlobalVariableModel.GlobalVariable> = new Array<GlobalVariableModel.GlobalVariable>();
  private countLoadOfVariables: number = 0;

  constructor(
    private events: Events,
    private globalVariableService: GlobalVariableService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService
  ) { }

  ngOnInit() {
    this.intermediaryService.presentLoading();

    this.getTypes();
    this.getGlobalVariables();

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
          this.listVariables.push({ type: type.id, value: null });
        }
      }
    } else {
      this.listVariables = this.listVariablesFromDb;
    }
    this.listVariables.sort((a, b) => {
      return a.type < b.type ? -1 : 1;
    })
  }

  getGlobalVariables() {
    this.globalVariableService
      .getAll()
      .subscribe((globalVariables) => {
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

}
