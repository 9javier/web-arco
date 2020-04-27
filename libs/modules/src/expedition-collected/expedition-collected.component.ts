import { BehaviorSubject, of, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit, Query, NgModule, Input,Output,EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import * as Filesave from 'file-saver';
import * as _ from 'lodash';
import { parse } from 'querystring';
import { NgxFileDropModule } from  'ngx-file-drop' ;
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Platform, ModalController, NavController  } from '@ionic/angular';
import { IntermediaryService } from '../../../services/src';
import {MatTabsModule, MatTabChangeEvent} from '@angular/material/tabs';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { DefectiveRegistryModel } from '../../../services/src/models/endpoints/DefectiveRegistry';
import { SelectionModel } from '@angular/cdk/collections';
import DefectiveRegistry = DefectiveRegistryModel.DefectiveRegistry;
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { DamagedModel } from '../../../services/src/models/endpoints/Damaged';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { DefectiveRegistryService } from '../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { parseDate } from '@ionic/core/dist/types/components/datetime/datetime-util';
import { ExpeditionCollectedService } from '../../../services/src/lib/endpoint/expedition-collected/expedition-collected.service';
import { PackageCollectedComponent } from './package-collected/package-collected.component';

@Component({
  selector: 'suite-expedition-collected',
  templateUrl: './expedition-collected.component.html',
  styleUrls: ['./expedition-collected.component.scss']
})

export class ExpeditionCollectedComponent {
  selectedIndex = 0;
  indexTab;
  indexToIdTranport=[];
  sendEvent:boolean=false;
  dataTransport: any;
  buttonSend:boolean;
  @ViewChild('#tabGroup') private tabGroup: MatTabsModule;
  @ViewChild('#selected') private tabSelected: PackageCollectedComponent;

  constructor(
    private defectiveRegistryService: DefectiveRegistryService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private intermediary: IntermediaryService,
    private expeditionCollectedService: ExpeditionCollectedService,
    private navCtrl: NavController,
    ){
      
  }
  ngOnInit(){
    this.getTranports();
  }

 public async refresh(){
    let tab= this.indexToIdTranport.find(element => element.index == this.indexTab);
     this.expeditionCollectedService.setEmitTabId(tab.idTransport);
  }

 public async send(){
    //let tabs= this.indexToIdTranport.find(element => element.index == this.indexTab);
    //this.expeditionCollectedEmiterService.sendButtonEmmit(tabs.idTransport);
    this.sendEvent == true ? this.sendEvent = false:this.sendEvent = true;
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.indexTab = tabChangeEvent.index;
    tabChangeEvent.tab.ngOnDestroy();
  }

  async getTranports(){
     this.expeditionCollectedService.getTrasnport().subscribe((result)=>{
      this.dataTransport = result;
      this.assignIdTransportToIndex();
    },
    async (err) => {
      console.log(err);
    });
  }

  assignIdTransportToIndex(){
    let i=0;
    this.dataTransport.forEach(element => {
      this.indexToIdTranport.push(
        {
          index:i,
          idTransport: element.id
        });
      i++;
    });
  }
  buttonState($event){
    this.buttonSend = $event;
  }
}
