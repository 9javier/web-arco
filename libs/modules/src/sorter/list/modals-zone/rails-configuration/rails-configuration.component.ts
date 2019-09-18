import { Component, OnInit } from '@angular/core';
import { IntermediaryService } from '@suite/services';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-rails-configuration',
  templateUrl: './rails-configuration.component.html',
  styleUrls: ['./rails-configuration.component.scss']
})
export class RailsConfigurationComponent implements OnInit {

  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
  ) { }

  ngOnInit() {
  }

  
  close():void{
    this.modalController.dismiss();
  }

  submit():void{
    console.log('submit')
  }

}
