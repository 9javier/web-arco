import { Component, OnInit, ViewChild } from '@angular/core';
import { SortModel } from '../../../services/src/models/endpoints/Sort';
import { MatPaginator } from '@angular/material';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { IntermediaryService } from '../../../services/src';
import { DefectiveRegistryService } from '../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { DefectiveRegistryModel } from '../../../services/src/models/endpoints/DefectiveRegistry';
import DefectiveRegistry = DefectiveRegistryModel.DefectiveRegistry;
import { ModalController } from '@ionic/angular';
import { RegistryDetailsComponent } from '../components/modal-defective/registry-details-al/registry-details-al.component';

@Component({
  selector: 'suite-defect-handler',
  templateUrl: './defect-handler.component.html',
  styleUrls: ['./defect-handler.component.scss']
})
export class DefectHandlerComponent implements OnInit {

  defects: Array<any> = [];
  pagerValues = [50, 100, 500];
  private page: number = 1;
  private limit: number = this.pagerValues[0];
  private sortValues: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;
  displayedColumns: string[] = ['barcode', 'registerDate', 'state'];
  dataSource: any;

  body: any = {
    "product": [],
    "dateDetection": [],
    "statusManagementDefect": [],
    "defectTypeParent": [],
    "defectTypeChild": [],
    "numberObservations": [],
    "photo": [],
    "warehouse": [],
	"orderby": {
		"type": 12,
		"order": "desc"
	},
	"pagination": {
		"page": 1,
		"limit": 50
	}
};

  constructor(
    private intermediaryService: IntermediaryService,
    private router: Router,
    private defectiveRegistryService: DefectiveRegistryService,
    private modalController: ModalController,

  ) { }

  ionViewWillEnter() {
    this.getList();
  }
  ngOnInit() {
    // this.initList()
    // this.listenChanges()
    this.getList();
  }
  // listenChanges(): void {
  //   let previousPageSize = this.limit;
  //   /**detect changes in the paginator */
  //   this.paginatorComponent.page.subscribe(page => {
  //     /**true if only change the number of results */
  //     let flag = previousPageSize == page.pageSize;
  //     previousPageSize = page.pageSize;
  //     this.limit = page.pageSize;
  //     this.page = flag ? page.pageIndex : 1;
  //     this.getList(this.page, this.limit, this.sortValues);
  //   });
  // }

  // initList() {
  //   this.intermediaryService.presentLoading() 
  //   const body = {
  //     pagination: {
  //       page: 1,
  //       limit: 50
  //     },
  //     orderBy: {
  //       type: 'barcode',
  //       order: 'asc'
  //     }
  //   }
  //   this.defectiveRegistryService.getAllIncidentProduct(body).subscribe(
  //     resp => {

  //       this.defects = resp.results;
  //       console.log(this.defects);
  //       this.defects.map(elem => {
  //         elem.registerDate = moment(elem.registerDate).format('DD-MM-YYYY')
  //       })
  //       this.dataSource = this.defects
  //       let paginator = resp.pagination;
  //       this.paginatorComponent.length = paginator.totalResults;
  //       this.paginatorComponent.pageIndex = paginator.selectPage;
  //       this.paginatorComponent.lastPage = paginator.lastPage;
  //     },
  //     err => {
  //       console.log(err);
  //       this.intermediaryService.dismissLoading()
  //     },
  //     () => {
  //       this.intermediaryService.dismissLoading()
  //     }
  //   )
  // }


  getList() {
    // console.log('sort', sort);
    
    // const body = {
    //   pagination: {
    //     page,
    //     limit
    //   },
    //   orderBy: {
    //     type: sort.type,
    //     order: sort.order
    //   }
    // }
    this.defectiveRegistryService.getListDefect(this.body).subscribe(
      resp => {
        console.log(resp);
        this.defects = resp.results;
        console.log(this.defects);
        this.defects.map(elem => {
          elem.dateDetection = moment(elem.dateDetection).format('DD-MM-YYYY')
        })
        const statusManagementDefectTypes = {
            1:'Pendiente Decisión' ,
            2: 'Pendiente Reparación',
            3: 'Reparado',
            4: 'En Stock',
            5: 'En Transito',
        };
        this.defects.map(elem =>{
          switch (elem.statusManagementDefect.defectType) {
            case 1:
              elem.statusManagementDefect.defectType = "Pendiente Decisión"
              break;
            case 2:
              elem.statusManagementDefect.defectType = "Pendiente Reparación"
              break;
            case 3:
              elem.statusManagementDefect.defectType = "Reparado"
              break;
            case 4:
              elem.statusManagementDefect.defectType = "En Stock"
              break;
            case 5:
              elem.statusManagementDefect.defectType = "En Transito"
              break;
          
            default:
              break;
          }
        });
        this.dataSource = this.defects
        let paginator = resp.pagination;
        this.paginatorComponent.length = paginator.totalResults;
        this.paginatorComponent.pageIndex = paginator.selectPage;
        this.paginatorComponent.lastPage = paginator.lastPage;
      },
      err => {
        console.log(err);
        this.intermediaryService.dismissLoading()
      },
      () => {
        this.intermediaryService.dismissLoading()
      }
    )
  }
  // sortData(e){
  //   if (e.direction == '') {
  //     this.sortValues = { type: '', order: '' };
  //   } else {
  //     this.sortValues = { type: e.active.toLowerCase(), order: e.direction.toLowerCase() };
  //   }
  //   console.log(this.sortValues);
  //   this.getList(this.page, this.limit, this.sortValues);
  // }

  goDefect(row) {
    
    // const navigationExtras: NavigationExtras = {
    //   state : {
    //     "reference" : row.id,
    //   }      
    // };

    // this.router.navigate(['/incidents'], navigationExtras);

    this.goDetails(row);

  }

  async goDetails(registry: DefectiveRegistryModel.DefectiveRegistry) {
    return (await this.modalController.create({
      component: RegistryDetailsComponent,
      componentProps: {
        productId: registry.product.id,
        showChangeState: true
      }
    })).present();
  }

}
