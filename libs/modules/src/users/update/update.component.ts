import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray, FormControl } from '@angular/forms';
import { RolesService, RolModel } from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService,WarehouseModel, WarehousesService } from '@suite/services';
import { NavParams,ModalController } from '@ionic/angular';
import { UtilsComponent } from '../../components/utils/utils.component';
import { validators } from '../../utils/validators';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  /**the inputs of form */
  formBuilderDataInputs = {
    employedId:[''],
    name: ['', [Validators.required, Validators.minLength(4)]],
    roleId: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    address: [''],
    password: ['',Validators.minLength(4)],
    confirmPassword: [''],
    hasWarehouse:false,
    warehouseId:['']
  };

  /**list of warehouses */
  warehouses:Array<WarehouseModel.Warehouse> = [];

  /**the allowed roles of the user */
  private roles:Array<any> = [];
  /**id of the current user */
  private id;
  public updateForm:FormGroup;

  /**wrapper for common ionic component methods like loading */
  @ViewChild(UtilsComponent) utilsComponent:UtilsComponent;

  constructor(
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    private userService:UsersService,
    private navParams:NavParams,
    private modalController:ModalController,
    private warehouseService:WarehousesService
  ) {
    console.log(this.navParams);
    let id = this.id = this.navParams.data.id;
    this.getUser(id);
  }

    /**
   * Listen for changes in createForm for add and remove validator on warehouse depend it have or not
   */
  listenChanges():void {
    this.updateForm.get("hasWarehouse").valueChanges.subscribe(status=>{
      let warehouseControl = this.updateForm.get("warehouseId");
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
   * initialize the formbuilder that will be used in the form for update the user
   */
  initFormBuilder():void{
    this.updateForm = this.formBuilder.group(
      this.formBuilderDataInputs,
      {
        validators: [validators.MustMatch('password', 'confirmPassword'),validators.haveItems("roles")]
      }
    );
    console.log((this.updateForm));
  }

  /**
   * Get the user data bassed on their id, and set the values to the form
   * @param id-the id of the user
   */
  getUser(id:number):void{
    console.log(id);
    /**Acá no entendí muy bien el propósito de retornar un observable dentro de una promesa */
    this.userService.getShow(id).then(observable=>{
      observable.subscribe((response)=>{
        /**iba a usar el UserModel pero no está bien definido, así que prefiero no usarlo, sería bueno revisarlo */
        let user = response.body.data;
        console.log(user);
        this.updateForm.patchValue(user);     
        /**call here to handle the async */
        this.getRoles(user);
      });
    })
  }

  /**
   * close the current instance of update modal
   */
  close():void{
    this.modalController.dismiss();
  }

  /**
   * Get the roles from server and set checked the roles of user
   * @param user the user to compare
   */
  getRoles(user):void{
    this.rolesService
      .getIndex()
      .then((data: Observable<HttpResponse<RolModel.ResponseIndex>>) => {
        data.subscribe((res: HttpResponse<RolModel.ResponseIndex>) => {
          this.roles = res.body.data;
          let userRoles = user.roles.map(rol=>rol.id);
          console.log("user roles",userRoles);
          /**We need an array form control to manage the roles for the user*/
          this.updateForm.addControl("roles",new FormArray(
            this.roles.map(rol=>{
              /**In order to get the actives roles of user, 
               * if the user not have the rol the result of indexOf is -1, 
               * then -1+1 == 0 and !!0 is false !!anyNumber is true */
              return new FormControl(!!(1- -userRoles.indexOf(rol.id)));
            })
          ));          
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
    let user = this.updateForm.value;
    /**change the trues to ids and the false for nulls then remove the null values, to send only the ids of true roles */
    user.roles = user.roles.map((flag,i)=>flag?{id:this.roles[i].id}:null).filter(rolId=>rolId);
    user.id = this.id;
    user.roleId = user.roles?user.roles[0].id:null;
    this.utilsComponent.presentLoading();
    this.userService.putUpdate(this.sanitize(user)).then(observable=>{
      observable.subscribe(user=>{
        this.utilsComponent.dismissLoading();
        console.log(user);
        this.close()
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

  ngOnInit() {
    this.initFormBuilder();
    this.listenChanges();
    this.getWarehouses();
  }
}
