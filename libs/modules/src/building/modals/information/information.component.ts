import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {

  /**for send the data of the value */
  @Output() submit = new EventEmitter();

  /**form to export data */
  form:FormGroup = this.formBuilder.group({
    name:['',Validators.required]
  });

  constructor(
    private formBuilder:FormBuilder,
    private modalController:ModalController) { }

  ngOnInit() {
  }

   /**
    * close the current instance of update modal
    */
    close():void{
      this.modalController.dismiss();
    }

  /**
   * Send the data to the parent component
   */
  submitData():void{
    this.submit.emit(this.form.value);
  }

}
