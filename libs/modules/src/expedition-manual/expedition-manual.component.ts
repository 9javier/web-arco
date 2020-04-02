import { BehaviorSubject, of, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import * as Filesave from 'file-saver';
import * as _ from 'lodash';
import { parse } from 'querystring';
import { NgxFileDropModule } from  'ngx-file-drop' ;
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Platform, ModalController } from '@ionic/angular';
import { IntermediaryService } from '../../../services/src';
import {MatTabsModule} from '@angular/material/tabs';
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
import { NewIncidenceComponent } from './new-incidence/new-incidence.component';



@Component({
  selector: 'suite-expedition-manual',
  templateUrl: './expedition-manual.component.html',
  styleUrls: ['./expedition-manual.component.scss']
})

export class ExpeditionManualComponent {
  constructor(
    private defectiveRegistryService: DefectiveRegistryService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private intermediary: IntermediaryService,
    ) {
  }

  async openForm(){
    let modal = this.modalController.create({
      component: NewIncidenceComponent,
      componentProps: {
        data:{}
      }  
    });
     (await modal).present()

  }
}
