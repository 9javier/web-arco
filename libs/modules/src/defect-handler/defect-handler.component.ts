import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { IncidentsService, IntermediaryService, PriceModel} from '@suite/services';
import { DefectiveRegistryService } from '../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DefectiveRegistryModel } from '../../../services/src/models/endpoints/DefectiveRegistry';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { validators } from '../utils/validators';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { DamagedModel } from '../../../services/src/models/endpoints/Damaged';
import { DetailsRegisterComponent } from './details-register/details-register.component';
import { PrintTicketService } from '../../../services/src/lib/print-ticket/print-ticket.service';

@Component({
  selector: 'suite-defect-handler',
  templateUrl: './defect-handler.component.html',
  styleUrls: ['./defect-handler.component.scss']
})
export class DefectHandlerComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['id', 'product', 'registerDate', 'state', 'contact', 'print'];
  OrderSelect;
  dataSource;
  columns = {};
  entities;
  pagerValues = [10, 20, 80];

  mobileVersionTypeList: 'list' | 'table' = 'list';
  showFiltersMobileVersion: boolean = false;
  pauseListenFormChange = false;
  isRefresh = false;
  prices: Array<PriceModel.Price> = [];
  requestTimeout;

  ngInit: boolean;
  ngInitFilter: boolean;
  ticketEmit: boolean;
  /**Filters */
  product: Array<TagsInputOption> = [];
  model: Array<TagsInputOption> = [];
  size: Array<TagsInputOption> = [];
  color: Array<TagsInputOption> = [];
  brand: Array<TagsInputOption> = [];
  contact: Array<TagsInputOption> = [];
  statusManagementDefect: Array<TagsInputOption> = [];
  groups: Array<TagsInputOption> = [];

  /**form to select elements to print or for anything */
  selectedForm: FormGroup = this.formBuilder.group({
    selector: false
  }, {
    validators: validators.haveItems("toSelect")
  });

  form: FormGroup = this.formBuilder.group({
    product: [],
    model: [],
    size: [],
    color: [],
    brand: [],
    contact: [],
    dateDetection: [],
    statusManagementDefect: [],
    defectTypeParent: [],
    defectTypeChild: [],
    warehouse: [],
    pagination: this.formBuilder.group({
      page: 1,
      limit: this.pagerValues[0]
    }),
    orderby: this.formBuilder.group({
      type: 1,
      order: "asc"
    })
  });
  length: any;

  constructor(
    private intermediaryService: IntermediaryService,
    private router: Router,
    private defectiveRegistryService: DefectiveRegistryService,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private printTicketService: PrintTicketService,
    private incidentsService: IncidentsService,
  ) { }

  ionViewWillEnter() {
    if (this.ngInit == false) {
      this.getList(this.form);
    }
    this.ngInit = false;
  }

  ngOnInit() {
    this.ngInit = true;
    this.initEntity();
    this.initForm();
    this.getFilters();
    this.listenChanges();
    this.getDefectListAfterUpdate();
  }

  initEntity() {
    this.entities = {
      product: [],
      model: [],
      size: [],
      color: [],
      brand: [],
      contact: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      warehouse: [],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
    }
  }

  initForm() {
    this.form.patchValue({
      product: [],
      model: [],
      size: [],
      color: [],
      brand: [],
      contact: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      warehouse: [],
      orderby: this.formBuilder.group({
        type: 1,
        order: "asc"
      })
    })
  }

  listenChanges() {
    let previousPageSize = this.form.value.pagination.limit;
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      /**true if only change the number of results */
      let flag = previousPageSize === page.pageSize;
      previousPageSize = page.pageSize;
      this.form.value.pagination = {
        limit: page.pageSize,
        page: flag ? page.pageIndex : 1
      };
      this.getList(this.form)
    });
  }

  getListData() {
    this.defectiveRegistryService.getListDefectAfterUpdate(this.form.value);

  }

  async getDefectListAfterUpdate() {
    this.defectiveRegistryService.getData().subscribe((resp: any) => {
      if (resp.results) {
        this.dataSource = new MatTableDataSource<DefectiveRegistryModel.DefectiveRegistry>(resp.results);
        const paginator = resp.pagination;
        this.groups = resp.ordertypes;
        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.selectPage;
        this.paginator.lastPage = paginator.lastPage;
      }
    },
      async err => {
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.dismissLoading()
      })
    //this.clearFilters();
    //this.getFilters();
  }

  async getList(form?: FormGroup) {
    this.defectiveRegistryService.getListDefect(form.value).subscribe((resp: any) => {
      if (resp.results) {
        this.dataSource = new MatTableDataSource<DefectiveRegistryModel.DefectiveRegistry>(resp.results);
        const paginator = resp.pagination;
        this.groups = resp.ordertypes;
        this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.selectPage;
        this.paginator.lastPage = paginator.lastPage;
      }
    },
      async err => {
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.dismissLoading()
      })
  }

  goDefect(row) {
    this.goDetails(row);
  }

  async goDetails(registry: DefectiveRegistryModel.DefectiveRegistry) {
    let modal = (await this.modalController.create({
      component: DetailsRegisterComponent,
      componentProps: {
        id: registry.id,
        productId: registry.product.id,
        showChangeState: true
      }
    }));


    modal.present();
  }

  openFiltersMobile() {
    this.showFiltersMobileVersion = !this.showFiltersMobileVersion;
  }

  applyFilters() {
    if (this.pauseListenFormChange) return;
    clearTimeout(this.requestTimeout);
    this.requestTimeout = setTimeout(async () => {

      await this.searchInContainer();
    }, 100);
  }

  getFilters(): void {
    this.ngInitFilter = true;
    this.defectiveRegistryService.getFiltersEntitiesFalseAl().subscribe((filters) => {
      this.product = filters.product;
      this.model = filters.model;
      this.size = filters.size;
      this.color = filters.color;
      this.brand = filters.brand;
      this.contact = filters.contact;
      this.statusManagementDefect = filters.statusManagementDefect;
      this.applyFilters();
    }, (err) => {
      console.log(err);
      this.isRefresh = false;
    });
  }

  async searchInContainer(): Promise<void> {
    await this.intermediaryService.presentLoading();

    const status = this.form.get('statusManagementDefect').value;

    if (Array.isArray(status)) {
      this.form.patchValue({ statusManagementDefect: status });
    } else {
      this.form.patchValue({ statusManagementDefect: [status] });
    }

    this.getList(this.form).then(async () => {
      this.showFiltersMobileVersion = false;
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.dismissLoading();
      this.isRefresh = false;
    }, async (err) => {
      console.log(err);
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.dismissLoading();
      this.isRefresh = false;
    });
  }

  sanitize(object) {
    /**mejorable */
    object = JSON.parse(JSON.stringify(object));
    if (!object.orderby.type) {
      delete object.orderby.type;
    } else {
      object.orderby.type = Number(object.orderby.type);
    }
    if (!object.orderby.order)
      delete object.orderby.order;
    if (object.productReferencePattern) {
      object.productReferencePattern = "%" + object.productReferencePattern + "%";
    }
    Object.keys(object).forEach(key => {
      if (object[key] instanceof Array) {
        if (object[key][0] instanceof Array) {
          object[key] = object[key][0];
        } else {
          for (let i = 0; i < object[key].length; i++) {
            if (object[key][i] === null || object[key][i] === "") {
              object[key].splice(i, 1);
            }
          }
        }
      }
      if (object[key] === null || object[key] === "") {
        delete object[key];
      }
    });
    return object;
  }

  private getFormValueCopy() {
    return JSON.parse(JSON.stringify(this.form.value || {}));
  }

  initSelectForm(items): void {
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect", this.formBuilder.array(items.map(prices => new FormControl(false))));
  }

  async sortData(event: Sort) {
    // this.form.value.orderby.type = this.columns[event.active];
    // this.form.value.orderby.order = event.direction !== '' ? event.direction : 'asc';
    //
    // this.intermediaryService.presentLoading('Cargando Filtros...').then(() => {
    //   this.getList(this.form);
    // });
  }

  clearFilters() {
    this.initForm();
    this.getFilters();
  }

  async refresh() {
    if (!this.isRefresh) {
      await this.intermediaryService.presentLoading();
      this.isRefresh = true;
      this.clearFilters();
    }
  }

  print(defective) {
    this.incidentsService.getData(defective).subscribe(
      resp => {
        if (resp.data.statusManagementDefect.ticketEmit == true) {
          this.printTicketService.printTicket(resp.data);
        }
      });
  }
}
