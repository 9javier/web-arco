import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';

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

  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
  }

  /**send the form to the endpoint */
  submit():void{

  }
}
