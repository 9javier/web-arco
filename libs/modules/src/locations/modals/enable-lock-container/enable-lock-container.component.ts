import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-enable-lock-container',
  templateUrl: './enable-lock-container.component.html',
  styleUrls: ['./enable-lock-container.component.scss']
})
export class EnableLockContainerComponent implements OnInit {

  /**The form group to register the data */
  form:FormGroup = this.formBuilder.group({
    activate:true,
    lock:false,
    hall:'',
    height:'',
    column:''
  });

  constructor(private formBuilder:FormBuilder,private modalController:ModalController) { }

  ngOnInit() {
  }

  /**Close the current instance of the modal */
  close():void{
    this.modalController.dismiss();
  }

  /**send the form to the endpoint */
  submit():void{

  }
}
