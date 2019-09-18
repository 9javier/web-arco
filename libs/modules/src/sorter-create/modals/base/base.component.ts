import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'suite-base-create',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() set sorter(sorter){
    if(sorter) {
      console.log(sorter);
      this.form.patchValue(sorter);
    }
  }

  @Input() wareHouses: any;

  form:FormGroup = this.formBuilder.group({
    id: [''],
    nombre: ['', Validators.required],
    carriles: ['', Validators.required],
    altura: ['', Validators.required],
    columna: ['', Validators.required],
    wareHouse: ['', Validators.required],
    colores: ['', Validators.required]
  });

  constructor(
    private formBuilder:FormBuilder
  ) { }

  
  getValue(){
    return this.sanitize(this.form.value);
  }

  sanitize(template){
    Object.keys(template).forEach(key=>{
      if(!template[key])
        delete template[key];
    });
    return template;
  }

  ngOnInit() {
  }

}
