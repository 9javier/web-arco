import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { RolesService, RolModel, PermissionsService, PermissionsModel } from '@suite/services';
import { validators } from '../../../../utils/validators';

@Component({
  selector: 'suite-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {

  permissions:Array<PermissionsModel.Permission> = [];
  form:FormGroup = this.formBuilder.group({
    id:'',
    name:['',[Validators.required]],
    description:['',[Validators.required]],
    sga_enabled: false,
    app_enabled: false,
    status:true
  },{
    validators:[validators.haveItems("groups")]
  });

  @Input() rol = {};
  constructor(private permissionService:PermissionsService,private roleService:RolesService,private formBuilder:FormBuilder) {
  }

  ngOnInit() {
    this.getPermisions();
  }

  /**
   * get permissions from the server and add its to the formGroup
   */
  getPermisions():void{
    this.permissionService.getIndex().then(observable=>{
      observable.subscribe(permissions=>{
        this.permissions = permissions.body.data;
        console.log(this.permissions);
        console.log(observable);
        this.form.addControl('groups',this.formBuilder.array(
          this.permissions.map(permission=>new FormControl(false))
        ));
        console.log(this.toPatch(this.rol));
        this.form.patchValue(this.toPatch(this.rol));
      })
    })
  }

  /**
   * sanitize the object
   * @param object - the object to be sanitized
   */
  sanitize(object){
    object = JSON.parse(JSON.stringify(object));
    if(!object.id)
      delete object.id
    /**change the trues for the id's */
    object.groups = object.groups.map((group,index)=>group?this.permissions[index].id:false).filter(permission=>permission);
    return object;
  }

  /**
   * similar to sanitize method but its sanitize for patch the value
   * @param object - object to sanitize
   */
  toPatch(object){
    console.log(object,this.permissions)
    object = JSON.parse(JSON.stringify(object));
    /**convert complex group to form format*/
    if(object.groups)
      object.groups = this.permissions.map(permission=>!!object.groups.find(_permission=>permission.id == _permission.id));
    return object;
  }

  /**
   * @returns the values of form
   */
  getValue(){
    return this.sanitize(this.form.value);
  }

}
