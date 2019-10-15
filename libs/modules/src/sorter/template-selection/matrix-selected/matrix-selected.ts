import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MatrixSorterModel} from "../../../../../services/src/models/endpoints/MatrixSorter";
import {TemplateSorterModel} from "../../../../../services/src/models/endpoints/TemplateSorter";
import {Events} from "@ionic/angular";
import {TemplateZonesService} from "../../../../../services/src/lib/endpoint/template-zones/template-zones.service";
import {IntermediaryService} from "@suite/services";
import {HttpRequestModel} from "../../../../../services/src/models/endpoints/HttpRequest";

@Component({
  selector: 'suite-sorter-matrix-selected',
  templateUrl: './matrix-selected.html',
  styleUrls: ['./matrix-selected.scss']
})
export class SorterMatrixSelectedComponent implements OnInit, OnDestroy {

  @Output() applyTemplateSelected = new EventEmitter();

  private LOAD_MATRIX_TEMPLATE: string = 'load_matrix_template';
  private DRAW_TEMPLATE_MATRIX: string = 'draw_template_matrix';

  template: TemplateSorterModel.Template = null;
  public sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[] = [];
  public loadingSorterTemplateMatrix: boolean = false;

  constructor(
    private events: Events,
    private intermediaryService: IntermediaryService,
    private templateZoneService: TemplateZonesService,
  ) { }

  ngOnInit() {
    this.events.subscribe(this.LOAD_MATRIX_TEMPLATE, (sorterAndTemplate: {sorter: number, template: TemplateSorterModel.Template}) => {
      this.template = sorterAndTemplate.template;
      let idSorter = sorterAndTemplate.sorter;

      this.loadTemplateMatrix(idSorter, this.template.id);
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.LOAD_MATRIX_TEMPLATE);
  }

  async applyTemplate() {
    this.applyTemplateSelected.next(this.template);
  }

  private loadTemplateMatrix(idSorter, idTemplate) {
    this.loadingSorterTemplateMatrix = true;
    this.sorterTemplateMatrix = [];
    this.events.publish(this.DRAW_TEMPLATE_MATRIX, this.sorterTemplateMatrix);
    this.templateZoneService
      .getMatrixTemplateSorter(idSorter, idTemplate)
      .subscribe((res: MatrixSorterModel.MatrixTemplateSorter[]) => {
        this.loadingSorterTemplateMatrix = false;
        this.sorterTemplateMatrix = res;
        this.events.publish(this.DRAW_TEMPLATE_MATRIX, this.sorterTemplateMatrix);
      }, async (error: HttpRequestModel.Error) => {
        let errorMessage = 'Ha ocurrido un error al intentar cargar los datos de la plantilla';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        this.loadingSorterTemplateMatrix = false;
        await this.intermediaryService.presentToastError(errorMessage);
      });
  }

}
