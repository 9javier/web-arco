import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DamagedModel } from '../../../../services/src/models/endpoints/Damaged';

@Component({
  selector: 'suite-add-damaged-shoes',
  templateUrl: './add-damaged-shoes.component.html',
  styleUrls: ['./add-damaged-shoes.component.scss'],
})
export class AddDamagedShoesComponent implements OnInit {
  tPermissions: DamagedModel.Permission[];
  tActions: DamagedModel.Action[];

  classifications: {
    id: number,
    name: string,
    statuses: {
      id: number,
      name: string
    }[]
  }[] = [];

  statuses: {
    id: number,
    name: string
  }[] = [];

  actions: {
    id: number,
    name: string,
    isChecked: boolean
  }[] = [];

  form: {
    classificationId: number,
    statusId: number,
    actions: {
      id: number,
      name: string,
      isChecked: boolean
    }[]
  } = {
    classificationId: 0,
    statusId: 0,
    actions: []
  };

  selectedClassificationId: number;
  selectedStatusId: number;

  constructor(
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    console.log(this.tPermissions);
    console.log(this.classifications);
    console.log(this.classifications);
    for(let permission of this.tPermissions){
      let included = false;
      for(let classification of this.classifications){
        if(classification.id === permission.classification.id){
          included = true;
          break;
        }
      }
      if(!included){
        this.classifications.push({
          id: permission.classification.id,
          name: permission.classification.name,
          statuses: []
        })
      }
      included = false;
      for(let status of this.statuses){
        if(status.id === permission.status.id){
          included = true;
          break;
        }
      }
      if(!included){
        this.statuses.push({
          id: permission.status.id,
          name: permission.status.name
        })
      }
    }
    for (let classification of this.classifications) {
      classification.statuses = JSON.parse(JSON.stringify(this.statuses));
    }

    for(let classification of this.classifications){
      for(let i = 0; i < classification.statuses.length; i++){
        for(let permission of this.tPermissions){
          if(permission.classification.id === classification.id && permission.status.id === classification.statuses[i].id){
            delete classification.statuses[i];
            break;
          }
        }
      }
      classification.statuses = classification.statuses.filter(function( status ) {
        return status !== undefined;
      });
    }

    for(let i = 0; i < this.classifications.length; i++){
      if(this.classifications[i].statuses.length === 0){
        delete this.classifications[i];
      }
    }
    this.classifications = this.classifications.filter(function( classification ) {
      return classification !== undefined;
    });

    if(this.classifications.length === 0){
      setTimeout(async () => await this.close(), 100);
    } else{
      for(let action of this.tActions){
        this.actions.push({
          id: action.id,
          name: action.name,
          isChecked: false
        })
      }
      this.selectedClassificationId = this.classifications[0].id;
      this.selectedStatusId = this.classifications[0].statuses[0].id;
      this.form = {
        classificationId: this.classifications[0].id,
        statusId: this.classifications[0].statuses[0].id,
        actions: this.actions
      };
    }
  }

  uncheckActions(){
    for(let action of this.form.actions) {
      action.isChecked = false;
    }
  }

  changeClassification(classificationId: number) {
    this.selectedClassificationId= classificationId;
    this.form.classificationId = this.selectedClassificationId;
    // this.selectedStatusId = this.getSelectedClassificationStatus()[0].id;
    this.form.statusId = this.selectedStatusId;
    this.uncheckActions();
  }

  changeStatus(statusId: number) {
    this.selectedStatusId = statusId;
    this.form.statusId = statusId;
    this.uncheckActions();
  }

  changeAction(actionId: number){
    for(let action of this.form.actions){
      if(action.id === actionId){
        action.isChecked = !action.isChecked;
      }
    }
  }

  getSelectedClassificationStatus(){
    for(let classification of this.classifications){
      if(classification.id === this.selectedClassificationId){
        return classification.statuses ? classification.statuses.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0) : [];
      }
    }
    return [];
  }

  noActionsChecked(): boolean {
    for(let action of this.form.actions){
      if(action.isChecked){
        return false;
      }
    }
    return true;
  }

  async close() {
    await this.modalController.dismiss();
  }

  async submit() {
    await this.modalController.dismiss(this.form);
  }
}
