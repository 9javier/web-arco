import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray, FormControl } from '@angular/forms';
import { RolesService, RolModel } from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService,WarehouseModel, WarehousesService } from '@suite/services';
import { NavParams,ModalController, AlertController } from '@ionic/angular';
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
    email: ['', [Validators.required/*, Validators.email*/]],
    address: [''],
    password: ['',Validators.minLength(4)],
    confirmPassword: [''],
    hasWarehouse:false,
    warehouseId:[''],
    permits: new FormArray([])
    
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
    private warehouseService:WarehousesService,
    private alertController:AlertController
  ) {
    console.log(this.navParams);
  }
  /**
   * Attach warehouse to user
   * @param warehouseId - id of warehouse to add
   */
  addWarehouseToUser(warehouseId:number):void{
    console.log(this.updateForm);
    (<FormArray>this.updateForm.get("permits")).push(this.formBuilder.group({
      name:this.warehouses.find(warehouse=>warehouse.id == warehouseId).name,
      warehouse:warehouseId,
      roles:(new FormArray(this.roles.map(rol=>new FormControl(false))))
    }));
    console.log("this is the warehouse id", warehouseId);
  }

    /**
   * Delete permission from formgroup to send to server
   * @param index the index of the permission to be deleted
   */
  deletePermision(event,index:number):void{
    event.preventDefault();
    event.stopPropagation();
    (<FormArray>this.updateForm.get("permits")).removeAt(index);
  }

   /**
   * Open prompt for select and create a new warehouse to attach to the user for select permissions
   * @param callback - using for execute before
   */
  async selectNewWarehouse(callback:Function){
    const alert = await this.alertController.create({
      header:"Asignar warehouse",
      inputs: this.warehouses.map(warehouse=>{
        return (<any>{
          name:"warehouse",
          label:warehouse.name,
          type:"radio",
          value:warehouse.id
        })
      }),
      buttons:[{
        text:'Cancelar'
      },(<any>{
        text:'Añadir',
        handler:(data)=>{
          callback.bind(this)(data);
        }
      })]
    });
    return alert.present();
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
        validators: [validators.MustMatch('password', 'confirmPassword'),validators.havePermits("permits")]
      }
    );
    this.updateForm.addControl("permits",new FormArray([]));
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
        this.getRoles(user);
        (<any>user).warehouseId = user.warehouse && user.warehouse.id;
        console.log(user);
        this.updateForm.patchValue(user);     
        console.log(user);
        /**call here to handle the async */
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
          this.updateForm.addControl("permits", new FormArray([]))
          this.roles = res.body.data;
          user.permits.forEach(permit=>{
            (<FormArray>this.updateForm.get("permits")).push(this.formBuilder.group({
              name:permit.warehouse.name,
              warehouse:permit.warehouse.id,
              roles:(new FormArray(this.roles.map(rol=>new FormControl(!!permit.roles.find(_rol=>{
                return rol.id==_rol.rol.id
              })))))
            }));
          });
          /*let permits = user.permits;
          for(let i = 0; i < permits.length;i++){
            let userRoles = permits[i].roles.map(rol=>rol.id);
            (<FormArray>this.updateForm.controls.permits).push(this.formBuilder.group({
              name:this.warehouses.find(warehouse=>warehouse.id == permits[i].warehouseId).name,
              warehouseId:permits[i].warehouseId,
              roles: this.roles.map(rol=>{
                /**In order to get the actives roles of user, 
                 * if the user not have the rol the result of indexOf is -1, 
                 * then -1+1 == 0 and !!0 is false !!anyNumber is true */
            /*    return new FormControl(!!(1- -userRoles.indexOf(rol.id)));
              })
            }));
          }  */ 
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
    let roles = [];
    let user = this.updateForm.value;
    /**change the trues to ids and the false for nulls then remove the null values, to send only the ids of true roles */
    //user.roles = user.roles.map((flag,i)=>flag?{id:this.roles[i].id}:null).filter(rolId=>rolId);
    user.permits = user.permits.map((permit,i)=>{
      permit.roles = permit.roles.map((flag,i)=>{
        let rol = flag?({rol:this.roles[i].id}):null;
        if(rol && !roles.find(_rol=>_rol.id == rol.rol))
          roles.push({id:rol.rol});
        return rol;
      }).filter(rolId=>rolId);
      return permit;
    });
    user.roles = roles;
    user.id = this.id;
   
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
          let id = this.id = this.navParams.data.id;
          this.getUser(id);
      });
    });
  }

  ngOnInit() {
    this.initFormBuilder();
    this.listenChanges();
    this.getWarehouses();
  }
}
