import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DamagedModel } from '../../../../services/src/models/endpoints/Damaged';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'suite-add-damaged-shoes',
  templateUrl: './add-damaged-shoes.component.html',
  styleUrls: ['./add-damaged-shoes.component.scss'],
})
export class AddDamagedShoesComponent implements OnInit {
  tAction: DamagedModel.Action[];

  formGroup: FormGroup;

  form: {
    name: string,
    actions: {
      id: number,
      name: string,
      isChecked: boolean
    }[]
  } = {
    name: '',
    actions: []
  };

  constructor(
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.formGroup = new FormGroup({name: new FormControl()});
    const actions = this.tAction.map((x) => {
      return { id: x.id, name: x.name, isChecked: false}
    });

    this.form = {
      name: this.form.name,
      actions: actions
    };
  }

  changeAction(actionId: number){
    for(let action of this.form.actions){
      if(action.id === actionId){
        action.isChecked = !action.isChecked;
      }
    }
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
    this.form.name = this.formGroup.get('name').value;
    await this.modalController.dismiss(this.form);
  }

}
