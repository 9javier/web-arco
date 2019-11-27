import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DataComponent } from '../data/data.component';
import { CarrierService, IntermediaryService } from '@suite/services';
import { StateExpeditionAvelonService } from 'libs/services/src/lib/endpoint/state-expedition-avelon/state-expedition-avelon.service';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  @ViewChild(DataComponent) data:DataComponent;

  formBuilderDataInputs = {
    name: ['', [Validators.required]],
    status: ['', []]
  };
  formBuilderTemplateInputs = [
    {
      name: 'name',
      label: 'Ej. J0001',
      type: 'reference'
    },
    {
      name: 'status',
      label: 'Ej. J0001',
      type: 'checkbox'
    }
  ];
  title = 'Crear estado de expedition';
  redirectTo = '/state-expedition-avelon';
  public formGroup: FormGroup;

  constructor(
    private modalController:ModalController,
    private stateExpeditionService:StateExpeditionAvelonService,
    private intermediaryService:IntermediaryService,
    private formBuilder: FormBuilder 
  ) {}

  ngOnInit() {
    this.buildForm();
  }
  private buildForm(){
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      status: true
    });
  }

  submit(){
    let value = this.formGroup.value;
    this.intermediaryService.presentLoading();
    this.stateExpeditionService.store(value).subscribe(data=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Estado de expedición guardada con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error creando la estado de expedición");
    })
  }

  close():void{
    this.modalController.dismiss();
  }
}
