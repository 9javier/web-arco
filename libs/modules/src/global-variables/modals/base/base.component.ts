import { Component, OnInit, Input } from '@angular/core';
import { GlobalVariableModel, GlobalVariableService, IntermediaryService } from '@suite/services';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'suite-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() set variable(variable:GlobalVariableModel.GlobalVariable){
    if(variable){
      this.form.addControl("id",new FormControl);
      this.form.patchValue(variable);
    }
  }

  types:{id:number;name:string;}[] = [];
  repeat: number;
  form: FormGroup;
  items: FormArray;
  /*
  form:FormGroup = this.formBuilder.group({
    type:['',Validators.required],
    value:['',Validators.required],
  });
  */

  constructor(
    private formBuilder:FormBuilder,
    private globalVariableService:GlobalVariableService,
    private intermediaryService:IntermediaryService,) { }

  ngOnInit() {
    this.getTypes();
   // this.items = new FormArray([])
  }

  getTypes(){
    this.intermediaryService.presentLoading();
    this.globalVariableService.getTypes().subscribe(types=>{
      this.types = types;
    }, (err) => {
    }, () => {
      this.intermediaryService.dismissLoading();
      this.form = this.formBuilder.group({
        items: this.formBuilder.array([])
      });
      for (let i = 0; i < this.types.length; i++) {
          this.items = this.form.get('items') as FormArray;

          this.items.push(
    
            this.formBuilder.group({
              type: this.types[i].id,
              value: ['', Validators.required]
            })
    
          );
      }
    });
  }

  addItem(): void {
    this.items = this.form.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      type:['',Validators.required],
      value:['',Validators.required],
    });
  }

  getValue():GlobalVariableModel.GlobalVariable[]{

      for(var i=0;i<this.items.length;i++){

        let array=this.form.controls.items as FormArray
        let group=array.at(i) as FormGroup
        return array.value;
    }
  }
}
