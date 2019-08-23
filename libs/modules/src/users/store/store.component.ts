import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { RolesService, RolModel, WarehousesService, WarehouseModel } from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { UsersService, UserModel } from '@suite/services';
import { ModalController, AlertController } from '@ionic/angular';
import { UtilsComponent } from '../../components/utils/utils.component';
import { validators } from '../../utils/validators';


@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  warehouseControl: any;
  /**wrapper for common ionic component methods like loading */
  @ViewChild(UtilsComponent) utilsComponent: UtilsComponent;

  /**list of warehouses */
  warehouses: Array<WarehouseModel.Warehouse> = [];

  /**the inputs of form */
  formBuilderDataInputs = {
    employedId: [''],
    name: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required/*, Validators.email*/]],
    address: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    hasWarehouse: false,
    warehouseId: [''],
    permits: new FormArray([])
  };


  /**the allowed roles of the user */
  private roles: Array<any> = [];

  public createForm: FormGroup;



  constructor(
    private alertController: AlertController,
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private modalController: ModalController,
    private warehouseService: WarehousesService
  ) { }

  /**
   * Listen for changes in createForm for add and remove validator on warehouse depend it have or not
   */
  test(){
    console.log("change" + this.formBuilderDataInputs.permits.value);
    console.log(this.formBuilderDataInputs);
    
  }
  listenChanges(): void {
    this.createForm.get("hasWarehouse").valueChanges.subscribe(status => {
       this.warehouseControl = this.createForm.get("warehouseId");
      if (status) {
        this.warehouseControl.setValidators([Validators.required]);
        this.warehouseControl.updateValueAndValidity();
        if (this.formBuilderDataInputs.permits.length == 0) {
           this.selectNewWarehouse(this.addWarehouseToUser);  
        }
        for (let index in <FormArray>this.createForm.get("permits")) {
          (<FormArray>this.createForm.get("permits")).removeAt(1);
        }
      }
      else {
        this.warehouseControl.clearValidators();
        this.warehouseControl.updateValueAndValidity();
      }
    });
    console.log(this.formBuilderDataInputs);
  }

  /**
 * initialize the formbuilder that will be used in the form for create the user
 */
  initFormBuilder(): void {
    this.createForm = this.formBuilder.group(
      this.formBuilderDataInputs,
      {
        validators: [validators.MustMatch('password', 'confirmPassword'), validators.havePermits("permits")]
      }
    );
  }

  /**
   * Open prompt for select and create a new warehouse to attach to the user for select permissions
   * @param callback - using for execute before
   */
  async selectNewWarehouse(callback: Function) {
    const alert = await this.alertController.create({
      header: "Asignar warehouse",
      inputs: this.warehouses.map(warehouse => {
        return (<any>{
          name: "warehouse",
          label: warehouse.name,
          type: "radio",
          value: warehouse.id
        })
      }),
      buttons: [{
        text: 'Cancelar'
      }, (<any>{
        text: 'Añadir',
        handler: (data) => {
          callback.bind(this)(data);
        }
      })]
    });
    return alert.present();
  }

  /**
   * Attach warehouse to user
   * @param warehouseId - id of warehouse to add
   */
  addWarehouseToUser(warehouseId: number): void {
    console.log(this.createForm);
    (<FormArray>this.createForm.get("permits")).push(this.formBuilder.group({
      name: this.warehouses.find(warehouse => warehouse.id == warehouseId).name,
      warehouse: warehouseId,
      roles: (new FormArray(this.roles.map(rol => new FormControl(false))))
    }));    
    console.log("this is the warehouse id", warehouseId);
  }

  /**
   * Delete permission from formgroup to send to server
   * @param index the index of the permission to be deleted
   */
  deletePermision(event, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    (<FormArray>this.createForm.get("permits")).removeAt(index);
  }


  /**
  * close the current instance of update modal
  */
  close(): void {
    this.modalController.dismiss();
  }

  /**
   * Get the roles from server and set checked the roles of user
   */
  getRoles(): void {
    this.rolesService
      .getIndex()
      .then((data: Observable<HttpResponse<RolModel.ResponseIndex>>) => {
        data.subscribe((res: HttpResponse<RolModel.ResponseIndex>) => {
          this.roles = res.body.data;
          /**We need an array form control to manage the roles for the user*/
        });
      });
  }

  /**
   * Get all warehouses
   */
  getWarehouses(): void {
    this.warehouseService.getIndex().then(observable => {
      observable.subscribe(response => {
        if (response.body && response.body.data)
          this.warehouses = response.body.data;
      });
    });
  }

  /**
 * remove false values to the object to prevent unexpected behaviours
 * @param object - the object to sanitize
 * @returns sanitized object
 */
  sanitize(object: any): any {
    Object.keys(object).forEach(key => {
      if (!object[key])
        delete object[key];
    })
    return object;
  }

  /**
 * update the user
 */
  submit(): void {
    let roles = [];
    let user = this.createForm.value;
    /**change the trues to ids and the false for nulls then remove the null values, to send only the ids of true roles */
    user.permits = user.permits.map((permit, i) => {
      permit.roles = permit.roles.map((flag, i) => {
        let rol = flag ? ({ rol: this.roles[i].id }) : null;
        if (rol && !roles.find(_rol => _rol.id == rol.rol))
          roles.push({ id: rol.rol });
        return rol;
      }).filter(rolId => rolId);
      return permit;
    });
    //user.roles = roles;
    //user.roleId = user.roles?user.roles[0].id:null;
    this.utilsComponent.presentLoading();
    this.userService.postStore(this.sanitize(user)).then(observable => {
      observable.subscribe(user => {
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
