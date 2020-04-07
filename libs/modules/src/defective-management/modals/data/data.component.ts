import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'suite-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  @Input() set parentId(_parent){
    if(_parent)
      this.form.get("defectTypeParent").patchValue(_parent, {emitEvent: false});
  };
  form:FormGroup = this.formBuilder.group({
    id:'',
    name:['',[Validators.required]],
    defectTypeParent:['']
  });

  @Input() set group(_group){
    if(_group)
      this.form.patchValue(_group);
  }
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
  }

  /**
   * Sanitize the nul values of data
   * @param object object to be cleaned
   */
  sanitize(object){
    let keys:Array<string> = Object.keys(object);
    keys.forEach(key=>{
      if(!object[key]){
        delete object[key];
      }
    });
    return object;
  }

  /**
   * Obtain the value of form
   */
  getValue(){
    return this.sanitize(this.form.value);
  }

}
