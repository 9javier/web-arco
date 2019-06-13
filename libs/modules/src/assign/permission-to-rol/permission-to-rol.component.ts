import { Component, OnInit, Injectable } from '@angular/core';
import { PermissionsService } from '../../../../services/src/lib/endpoint/permissions/permissions.service';
import { RolesService } from '../../../../services/src/lib/endpoint/roles/roles.service';
import { RolModel } from '../../../../services/src/models/endpoints/Rol';
import { PermissionsModel } from '../../../../services/src/models/endpoints/Permissions';
import { AclService } from '../../../../services/src/lib/endpoint/acl/acl.service';
import { ACLModel } from '../../../../services/src/models/endpoints/ACL';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ToastController, ModalController } from '@ionic/angular';
import { MatSelectionListChange, MatListOption } from '@angular/material/list';
import { mergeMap } from 'rxjs/operators';
import { StoreComponent } from "../../roles/store/store.component";
import { UpdateComponent } from "../../roles/update/update.component";
import { UpdateComponent as UpdateRolComponent} from './modals/update/update.component';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { validators } from '../../utils/validators';
import { IntermediaryService } from '../../../../services/src/lib/endpoint/intermediary/intermediary.service';

interface ShowRolPermissions extends PermissionsModel.Permission {
  selected?: boolean;
}
@Injectable()
@Component({
  selector: 'suite-permission-to-rol',
  templateUrl: './permission-to-rol.component.html',
  styleUrls: ['./permission-to-rol.component.scss']
})
export class PermissionToRolComponent implements OnInit {

  form:FormGroup = this.formBuilder.group({
    toDelete:this.formBuilder.array([])
  },{
    validators:validators.haveItems("toDelete")
  });

  public columnsToDisplay = ["name","description","delete"];
  /* Data Layer */
  permissions: PermissionsModel.Permission[] = [];
  roles: RolModel.Rol[] = [];
  currentRolPermissions: PermissionsModel.Permission[];

  /* Presentation Layer */
  panelOpenState = false;
  rolepermissionsSelected: ShowRolPermissions[] = [];
  isLoadingPermissions = false;
  isLoadingAssignPermissionToRole = false;
  indexSelected = 0;
  showDeleteButton = false;



  constructor(
    private intermediaryService:IntermediaryService,
    private formBuilder:FormBuilder,
    private permissionService: PermissionsService,
    private rolesService: RolesService,
    private aclService: AclService,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  /**
   * Launch a modal to update rol
   * @param rol - rol to be updated
   */
  async updateRol(rol){
    rol = JSON.parse(JSON.stringify(rol));
    let modal = (await this.modalController.create({
      component:UpdateRolComponent,
      componentProps:{
        rol:rol
      }
      
    }));
    modal.present();
    modal.onDidDismiss().then(data=>{
      this.getRoles();
    })
  }


  /**
   * show modal to confirm the deletion of selecteds roles
   */
  confirmDeletion():void{
    this.intermediaryService.presentConfirm("¿Está seguro de eliminar los roles seleccionados?",()=>{
      this.deleteRoles();
    });
  }

  /**
   * Delete the selected roles
   */
  deleteRoles():void{
    (<FormArray>this.form.controls.toDelete).controls.forEach((control,i)=>{
      if(control.value){
        this.intermediaryService.presentLoading();
        this.rolesService.destroy(this.roles[i].id).subscribe(()=>{
          this.intermediaryService.dismissLoading();
          this.getRoles();
        },()=>{
          this.intermediaryService.dismissLoading();
        });
      }
    })
  }

  ngOnInit() {
    console.log(this.form);
    this.getRoles();
  }

  /**
   * because the click row fire an update modal, need cancel the event of checkbox column
   * @param e - event
   */
  prevent(e):void{
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Select or unselect all fields
   * @param event - the event of the checkbox to determine if select or unselect the fields
   */
  selectAllToDelete(event):void{
    const value = event.detail.checked;
    (<FormArray>this.form.controls.toDelete).controls.forEach(control=>{
      control.setValue(value);
    });
  }

  getRoles(){
    Promise.all([
      this.permissionService.getIndex(),
      this.rolesService.getIndex()
    ]).then(
      (data: any) => {
        data[0].subscribe(
          (res: HttpResponse<PermissionsModel.ResponseIndex>) => {
            this.permissions = res.body.data;
            console.log(this.permissions);
          }
        );
        data[1].subscribe((res: HttpResponse<RolModel.ResponseIndex>) => {
          this.roles = res.body.data;
          this.form.removeControl("toDelete");
          this.form.addControl("toDelete",this.formBuilder.array(this.roles.map(toDelete=>new FormControl(false))));
          this.rolepermissionsSelected = this.roles;
          console.log(this.roles);
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  showRolPermissions(rolId: number) {
    let selectedPermissions = [];
    let unselectedPermissions = [];
    this.currentRolPermissions = [];
    this.panelOpenState = true;
    this.isLoadingPermissions = true;

    this.currentRolPermissions = this.roles.find(rol => rol.id === rolId)['groups'];
    // res.body.data.length === 0 ? [{ name: '', id: 0 }] : res.body.data;
    console.log('this.permissions', this.permissions);
    console.log('this.currentRolPermissions', this.currentRolPermissions);
    this.isLoadingPermissions = false;
    this.rolepermissionsSelected = [];
    // Applying Intersection, to get user roles selected
    selectedPermissions = this.permissions.filter((rol: RolModel.Rol) =>
      this.currentRolPermissions.find(rolData => rolData.id === rol.id)
    );

    // Applying Diference, to get user roles not selected
    unselectedPermissions = this.permissions.filter(
      (rol: RolModel.Rol) =>
        !this.currentRolPermissions.find(rolData => rolData.id === rol.id)
    );

    // adding selected property for mat-list-option component
    selectedPermissions = selectedPermissions.map((rol: RolModel.Rol) => {
      return { ...rol, selected: true };
    });

    unselectedPermissions = unselectedPermissions.map(
      (rol: RolModel.Rol) => {
        return { ...rol, selected: false };
      }
    );

    this.rolepermissionsSelected.push(
      ...selectedPermissions,
      ...unselectedPermissions
    );
  }

  assignPermissionToRol(
    permission: ShowRolPermissions,
    indexSelected: number,
    rol: RolModel.Rol,
    ev: MatListOption
  ) {
    this.isLoadingAssignPermissionToRole = true;
    console.log('assignPermissionToRol', permission);

    // Assign New Permission
    if (
      (ev.selected && !permission.selected) ||
      (ev.selected && permission.selected)
    ) {
      this.permissionService
        .postAssignPermissionToRol(rol.id, permission.id)
        .then((data: Observable<HttpResponse<ACLModel.ResponseUserRoles>>) => {
          data.subscribe(
            (res: HttpResponse<ACLModel.ResponseUserRoles>) => {
              this.isLoadingAssignPermissionToRole = false;
              ev.selected = true;
              this.presentToast(
                `Permiso ${rol.name} ha sido asignado el rol ${permission.name}`
              );
            },
            (errorResponse: HttpErrorResponse) => {
              this.isLoadingAssignPermissionToRole = false;
              this.presentToast(
                `${errorResponse.status} - ${errorResponse.message}`
              );
              ev.selected = false;
              // Unselect option due network error
              this.rolepermissionsSelected.splice(indexSelected, 1, {
                ...permission,
                selected: false
              });
            }
          );
        });
    }
    // Delete Rol
    if (
      (!ev.selected && permission.selected) ||
      (!ev.selected && !permission.selected)
    ) {
      console.log('Delete');
      this.permissionService
        .deletePermissionToRol(rol.id, permission.id)
        .then(
          (data: Observable<HttpResponse<ACLModel.ResponseDeleteUserRol>>) => {
            data.subscribe(
              (res: HttpResponse<ACLModel.ResponseDeleteUserRol>) => {
                this.isLoadingAssignPermissionToRole = false;
                ev.selected = false;
                this.presentToast(
                  `Permiso ${permission.name} fue removido de ${rol.name}`
                );
              },
              (errorResponse: HttpErrorResponse) => {
                this.isLoadingAssignPermissionToRole = false;
                this.presentToast(
                  `${errorResponse.status} - ${errorResponse.message}`
                );
                ev.selected = true;
                // Unselect option due network error
                this.rolepermissionsSelected.splice(indexSelected, 1, {
                  ...permission,
                  selected: true
                });
              }
            );
          }
        );
    }
  }

  trackById(index: number, permission: ShowRolPermissions): number {
    return permission.id;
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 4550
    });
    toast.present();
  }


  async goToStore() {
    let storeComponent = StoreComponent;
    let componentProps: any = { routePath: '/roles' };

    const modal = await this.modalController.create({
      component: storeComponent,
      componentProps: componentProps
    });

    modal.onDidDismiss()
      .then(() => {
        this.ngOnInit();
      });

    return await modal.present();
  }

  async goToUpdate(row) {

    const modal = await this.modalController.create({
      component: UpdateComponent,
      componentProps: { id: row.id, row: row, routePath: '/roles' }
    });

    modal.onDidDismiss()
      .then(() => {
        this.ngOnInit();
      });

    return await modal.present();
  }
}
