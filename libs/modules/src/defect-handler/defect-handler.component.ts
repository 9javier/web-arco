import { Component, OnInit, ViewChild } from '@angular/core';
import { SortModel } from '../../../services/src/models/endpoints/Sort';
import { MatPaginator } from '@angular/material';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { IntermediaryService, IncidentsService } from '../../../services/src';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';

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
  displayedColumns: string[] = ['barcode', 'registerDate', 'state', 'select'];
  dataSource: any;

  constructor(
    private intermediaryService: IntermediaryService,
    private router: Router,
    private incidentsService: IncidentsService,

  ) { }

  ngOnInit() {
    this.initList()
    this.listenChanges()
  }
  listenChanges(): void {
    let previousPageSize = this.limit;
    /**detect changes in the paginator */
    this.paginatorComponent.page.subscribe(page => {
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.limit = page.pageSize;
      this.page = flag ? page.pageIndex : 1;
      this.getList(this.page, this.limit, this.sortValues);
    });
  }

  initList() {
    this.intermediaryService.presentLoading() 
    const body = {
      pagination: {
        page: 1,
        limit: 50
      },
      orderBy: {
        type: 'barcode',
        order: 'asc'
      }
    }
    this.incidentsService.getAllIncidentProduct(body).subscribe(
      resp => {

        this.defects = resp.results;
        console.log(this.defects);
        this.defects.map(elem => {
          elem.registerDate = moment(elem.registerDate).format('DD-MM-YYYY')
        })
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


  getList(page: number, limit: number, sort: any) {
    console.log('sort', sort);
    
    const body = {
      pagination: {
        page,
        limit
      },
      orderBy: {
        type: sort.type,
        order: sort.order
      }
    }
    this.incidentsService.getAllIncidentProduct(body).subscribe(
      resp => {
        this.defects = resp.results
        console.log(this.defects);
        this.defects.map(elem => {
          elem.registerDate = moment(elem.registerDate).format('DD-MM-YYYY')
        })
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
  sortData(e) {
    if (e.direction == '') {
      this.sortValues = { type: '', order: '' };
    } else {
      this.sortValues = { type: e.active.toLowerCase(), order: e.direction.toLowerCase() };
    }
    console.log(this.sortValues);
    this.getList(this.page, this.limit, this.sortValues);
  }

  goDefect(row) {
    const navigationExtras: NavigationExtras = {
      state : {
        "reference" : row.id,
      }      
    };

    this.router.navigate(['/incidents'], navigationExtras);
  }

}
