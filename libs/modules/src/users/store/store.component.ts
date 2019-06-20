import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray, FormControl } from '@angular/forms';
import { RolesService, RolModel,WarehousesService,WarehouseModel } from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { UsersService,UserModel } from '@suite/services';
import { ModalController } from '@ionic/angular';
import { UtilsComponent } from '../../components/utils/utils.component';
import { validators } from '../../utils/validators';


@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
    
  /**wrapper for common ionic component methods like loading */
  @ViewChild(UtilsComponent) utilsComponent:UtilsComponent;

  /**list of warehouses */
  warehouses:Array<WarehouseModel.Warehouse> = [];

  /**the inputs of form */
  formBuilderDataInputs = {
    employedId:[''],
    name: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required/*, Validators.email*/]],
    address: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    hasWarehouse:false,
    warehouseId:['']
  };

  /**the allowed roles of the user */
  private roles:Array<any> = [];

  public createForm:FormGroup;



  constructor(
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    private userService:UsersService,
    private modalController:ModalController,
    private warehouseService:WarehousesService
  ) { }

  /**
   * Listen for changes in createForm for add and remove validator on warehouse depend it have or not
   */
  listenChanges():void {
    this.createForm.get("hasWarehouse").valueChanges.subscribe(status=>{
      let warehouseControl = this.createForm.get("warehouseId");
      warehouseControl.setValue("");
      if(status){
        warehouseControl.setValidators([Validators.required]);
        warehouseControl.updateValueAndValidity()
      }
      else{
        warehouseControl.clearValidators();
        warehouseControl.updateValueAndValidity();
      }
    });
  }

    /**
   * initialize the formbuilder that will be used in the form for create the user
   */
  initFormBuilder():void{
    this.createForm = this.formBuilder.group(
      this.formBuilderDataInputs,
      {
        validators: [validators.MustMatch('password', 'confirmPassword'),validators.haveItems("roles")]
      }
    );
  }
  
  /**
  * close the current instance of update modal
  */
  close():void{
    this.modalController.dismiss();
  }

  /**
   * Get the roles from server and set checked the roles of user
   */
  getRoles():void{
    this.rolesService
      .getIndex()
      .then((data: Observable<HttpResponse<RolModel.ResponseIndex>>) => {
        data.subscribe((res: HttpResponse<RolModel.ResponseIndex>) => {
          this.roles = res.body.data;
          /**We need an array form control to manage the roles for the user*/
          this.createForm.addControl("roles",new FormArray(
            this.roles.map(rol=>{
              return new FormControl(false);
            })
          ));          
        });
      });    
  }

  /**
   * Get all warehouses
   */
  getWarehouses():void{
    this.warehouseService.getIndex().then(observable=>{
      observable.subscribe(response=>{
        if(response.body && response.body.data)
          this.warehouses = response.body.data;
      });
    });
  }

    /**
   * remove false values to the object to prevent unexpected behaviours
   * @param object - the object to sanitize
   * @returns sanitized object
   */
  sanitize(object:any):any{
    Object.keys(object).forEach(key=>{
      if(!object[key])
        delete object[key];
    })
    return object;
  }

  /**
 * update the user
 */
submit():void{
  let user = this.createForm.value;
  /**change the trues to ids and the false for nulls then remove the null values, to send only the ids of true roles */
  user.roles = user.roles.map((flag,i)=>flag?{id:this.roles[i].id}:null).filter(rolId=>rolId);
  user.roleId = user.roles?user.roles[0].id:null;
  this.utilsComponent.presentLoading();
  this.userService.postStore(this.sanitize(user)).then(observable=>{
    observable.subscribe(user=>{
      this.utilsComponent.dismissLoading();
      console.log(user);
      this.close()
    });
  });
}

  ngOnInit() {
    this.initFormBuilder();
    this.getRoles();
    this.getWarehouses();
    this.listenChanges();
  }


}
