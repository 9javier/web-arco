import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';
import { SorterTemplateService } from 'libs/services/src/lib/endpoint/sorter-template/sorter-template.service';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;
  templateId: any;
  template: any;

  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams,
    private sorterTemplateService: SorterTemplateService,
  ) {
    this.templateId = this.navParams.get("templateId"); 
  }

  ngOnInit() {
    this.sorterTemplateService.getShow(this.templateId).subscribe(data =>{
      this.template = data.data;
    }, err => {
      console.log(err)
    })
  }

  close():void{
    this.modalController.dismiss();
  }

  submit():void{
    let payload = this.base.getValue()
    payload = {
      active:true,
      ...payload
    }
    console.log(payload)
    this.sorterTemplateService.updateTemplateSorter(payload, payload.id).subscribe((data) => {
      console.log(data.data);
      this.close();
    });
  }
}
