import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { RolModel, UserModel, IntermediaryService } from "@suite/services";
import { Observable } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { ModalController } from "@ionic/angular";
import { CrudService } from '../../../common/ui/crud/src/lib/service/crud.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { validators } from '../utils/validators';
import { Router } from '@angular/router';
import { UpdateComponent } from './modals/update/update.component';
import { StoreComponent } from './modals/store/store.component';
import { SorterTemplateService } from '../../../services/src/lib/endpoint/sorter-template/sorter-template.service';
import { TemplateSorterModel } from '../../../services/src/models/endpoints/TemplateSorter';
import { switchMap } from 'rxjs/operators';
import {SorterProvider} from "../../../services/src/providers/sorter/sorter.provider";

@Component({
  selector: 'suite-sorter',
  templateUrl: './sorter.component.html',
  styleUrls: ['./sorter.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateY(0)' })),
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.17s ease-in-out')
      ]),
      transition(':leave', [
        animate('0.17s ease-in-out', style({ transform: 'translateY(100%)' }))
      ])
    ]),
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', visibility: 'hidden', padding: '0' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('0ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('0ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class SorterComponent implements OnInit {

  displayedColumns = ['delete', 'nombre', 'zona', 'carriles', 'dropdown'];
  //dataSource = new ExampleDataSource();
  displayedColumnsWareHouse: any = ['check', 'name'];
  selectedForm: FormGroup;
  selectedFormActive: FormGroup;
  items: FormArray;
  toDeleteIds: number[] = [];

  constructor(
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalController: ModalController,
    private sorterTemplateService: SorterTemplateService,
    private intermediaryService: IntermediaryService,
    private sorterProvider: SorterProvider
  ) {
    this.selectedForm = this.formBuilder.group(
      {
        selector: false,
        selects: this.formBuilder.array([this.createSelect()]),
        global: false
      },
      {
        validators: validators.haveItems('toSelect')
      }
    );

    this.selectedFormActive = this.formBuilder.group(
      {
        selector: false,
        selects: this.formBuilder.array([this.createSelect()])
      },
      {
        validators: validators.haveItems('toSelectActive')
      }
    );
  }


  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  showExpasion: boolean = false;
  warehouses: any = [];
  templates: TemplateSorterModel.Template[] = [];

  ngOnInit() {
    this.sorterProvider.templateToEditSelected = null;
    this.crudService
      .getIndex('Warehouses')
      .then(
        (
          data: Observable<
            HttpResponse<UserModel.ResponseIndex | RolModel.ResponseIndex>
          >
        ) => {
          data.subscribe(
            (
              res: HttpResponse<
                UserModel.ResponseIndex | RolModel.ResponseIndex
              >
            ) => {
              this.warehouses = res.body.data;
              this.initSelect(this.warehouses);
            },
            (err) => {
              console.log(err)
            }, () => {

            }
          );
        }
      );
    this.sorterTemplateService.getIndex().subscribe((data) => {
      this.templates = data.data;
      this.initSelectActive(this.templates);
    })
  }

  clickShowExpasion(row: TemplateSorterModel.Template) {
    event.stopPropagation();
    this.sorterProvider.templateToEditSelected = row;
    this.router.navigate([`/sorter/plantilla/${row.id}/${row.equalParts}`]);
  }

  selectAll(event): void {
    let value = event.detail.checked;
    const controlArray = <FormArray>this.selectedForm.get('toSelect');
    controlArray.controls.forEach((control, i) => {
      control.setValue(value);
    });
    this.toDeleteIds = [];
    this.templates.forEach(template => {
      this.toDeleteIds.push(template.id);
    });
  }

  initSelect(items) {
    this.selectedForm.removeControl('toSelect');
    this.selectedForm.addControl('toSelect', this.formBuilder.array(items.map(item => new FormControl(Boolean(false)))));
  }

  selectAllActive(event): void {
    let value = event.detail.checked;
    const controlArray = <FormArray>this.selectedFormActive.get('toSelectActive');
    controlArray.controls.forEach((control, i) => {
      control.setValue(value);
    });
  }

  initSelectActive(items: TemplateSorterModel.Template[]) {
    this.selectedFormActive.removeControl('toSelectActive');
    this.selectedFormActive.addControl('toSelectActive', this.formBuilder.array(
      items.map(item => new FormControl(Boolean(item.active))))
    );
  }

  createSelect(): FormControl {
    return new FormControl(Boolean(false));
  }

  getTemplates() {
    this.intermediaryService.presentLoading();
    this.sorterTemplateService.getIndex().subscribe((data) => {
      this.templates = data.data;
      this.initSelectActive(this.templates);
      this.intermediaryService.dismissLoading();
    });
  }

  async update(row): Promise<void> {
    let modal = (await this.modalController.create({
      component: UpdateComponent,
      componentProps: {
        templateId: row.id
      }
    }));
    modal.onDidDismiss().then((response) => {
      if (response.data) {
        this.getTemplates();
      }
    });
    modal.present();
  }

  async store(): Promise<void> {
    let modal = (await this.modalController.create({
      component: StoreComponent
    }));
    modal.onDidDismiss().then((response) => {
      if (response.data) {
        this.getTemplates();
      }
    });
    modal.present();
  }

  active(element, check) {
    event.stopPropagation();
    let payload = element;
    payload = {
      active: check.value,
      ...payload
    }
    this.intermediaryService.presentLoading();
    this.sorterTemplateService.updateTemplateSorter(payload, payload.id).subscribe((data) => {
    }, (err) => {
      console.log(err)
    }, () => {
      this.getTemplates();
      this.intermediaryService.dismissLoading();
    });
  }

  toDeleteTemplate(index) {
    event.stopPropagation();
    let repeat = false;
    let idToDelete = this.templates[index].id;
    this.toDeleteIds.forEach(id => {
      if (id === idToDelete) {
        repeat = true;
      }
    });

    if (!repeat) {
      this.toDeleteIds.push(idToDelete);
    }
  }

  delete() {
    let deletions: Observable<any> = new Observable(observer => observer.next());
    if (this.toDeleteIds.length > 0) {
      this.toDeleteIds.forEach(id => {
        deletions = deletions.pipe(switchMap(() => {
          return (this.sorterTemplateService.deleteTemplateSorter(id))
        }))
      });
    }

    this.toDeleteIds = [];
    this.intermediaryService.presentLoading();

    deletions.subscribe(() => {
      this.intermediaryService.dismissLoading();
      this.getTemplates();
      this.intermediaryService.presentToastSuccess("Plantillas eliminadas con exito");
      const controlArray = <FormArray>this.selectedForm.get('toSelect');
      controlArray.controls.forEach((control, i) => {
        control.setValue(false);
      });
    }, () => {
      this.intermediaryService.dismissLoading();
      this.getTemplates();
      this.intermediaryService.presentToastError("No se pudieron eliminar algunas de las plantillas");
    });
  }

}

// export class ExampleDataSource extends DataSource<any> {
//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   data = [
//     { icon: '', Ntemplate: 1, zona: 2, dropdown: false, nombre: 'template1', carriles: 20 },
//     { icon: '', Ntemplate: 2, zona: 2, dropdown: false, nombre: 'template2', carriles: 23 },
//     { icon: '', Ntemplate: 3, zona: 2, dropdown: false, nombre: 'template3', carriles: 26 },
//   ];
//   connect(): Observable<Element[]> {
//     const rows = [];
//     this.data.forEach(element => rows.push(element, { detailRow: true, element }));
//     console.log(rows);
//     return of(rows);
//   }

//   disconnect() { }
// }
