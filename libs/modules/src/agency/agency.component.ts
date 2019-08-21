import { Component, OnInit } from '@angular/core';
import { AgencyService, AgencyModel, IntermediaryService } from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import { UpdateComponent } from './modals/update/update.component';

type select = {
  id:number;
  selected:boolean
}

@Component({
  selector: 'suite-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss']
})
export class AgencyComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'address', 'phone','select'];

  dataSource:MatTableDataSource<AgencyModel.Agency>;
  selectForm:FormGroup = this.formBuilder.group({
    selecteds: new FormArray([])
  });

  constructor(
    private agencyService:AgencyService,
    private formBuilder:FormBuilder,
    private intermediaryService:IntermediaryService,
    private modalController:ModalController
  ) { }

  ngOnInit() {
    this.getAgencies()
  }

  /**
   * Open modal to create new agency
   */
  async store():Promise<void>{
    let modal = (await this.modalController.create({
      component:StoreComponent
    }));
    modal.onDidDismiss().then(()=>{
      this.getAgencies();
    });
    modal.present();
  }

  /**
   * Open modal to update an agency
   */
  async update(agency:AgencyModel.Agency):Promise<void>{
    let modal = (await this.modalController.create({
      component:UpdateComponent,
      componentProps:{
        agency:agency
      }
    }));
    modal.onDidDismiss().then(()=>{
      this.getAgencies();
    })
    modal.present();
  }

  /**
   * Init a form to select each by each agency from array
   * @param agencies - a list of agencies
   */
  initSelectForm(agencies:AgencyModel.Agency[]){
    this.selectForm = this.formBuilder.group({
      selecteds: new FormArray([])
    });
    agencies.forEach(agency=>{
      (<FormArray>this.selectForm.get("selecteds")).push( this.formBuilder.group({
        id:agency.id,
        selected:false
      }))
    });
  }

  /**
   * determine if an array of objects have selected items
   */
  selecteds(selecteds:select[]):Array<number>{
    let aux = (selecteds.filter(selected=>{
      return selected.selected
    })).map(selected=>{
      return selected.id;
    })
    return aux.length?aux:null;
  }

  /**
   * Delete all agencies with id match with the ids in array
   * @param ids - ids of agencies
   */
  delete(ids:Array<number>){
    let observable = new Observable(observer=>observer.next());
    ids.forEach(id=>{
      observable = observable.pipe(switchMap(ressponse=>{
        return this.agencyService.delete(id);
      }))
    });
    this.intermediaryService.presentLoading();
    observable.subscribe(()=>{
      this.getAgencies();
      this.intermediaryService.dismissLoading();
    },error=>{
      this.intermediaryService.dismissLoading();
    }); 
  }

  /**
   * Stop the usual behaviour of an event and stop it propagation
   * @param event 
   */
  prevent(event){
    event.preventDefault();
    event.stopPropagation();
  }

  getAgencies():void{
    this.intermediaryService.presentLoading();
    this.agencyService.getAll().subscribe(agencies=>{
      this.dataSource = new MatTableDataSource(agencies);
      this.initSelectForm(agencies);
      this.intermediaryService.dismissLoading();
    });
  }
}
