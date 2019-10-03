import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TemplateSorterModel} from "../../../../../services/src/models/endpoints/TemplateSorter";
import {SorterTemplateService} from "../../../../../services/src/lib/endpoint/sorter-template/sorter-template.service";
import {IntermediaryService} from "@suite/services";
import {Events} from "@ionic/angular";

@Component({
  selector: 'suite-sorter-list-templates-selection',
  templateUrl: './list-templates.html',
  styleUrls: ['./list-templates.scss']
})
export class SorterListTemplatesSelectionComponent implements OnInit, OnDestroy {

  @Output() templateSelected = new EventEmitter();

  private RELOAD_LIST_TEMPLATES: string = 'reload_list_templates';

  listTemplates: TemplateSorterModel.Template[] = [];
  isLoadingTemplates: boolean = true;

  constructor(
    private events: Events,
    private intermediaryService: IntermediaryService,
    private sorterTemplateService: SorterTemplateService
  ) { }

  ngOnInit() {
    this.loadTemplates();

    this.events.subscribe(this.RELOAD_LIST_TEMPLATES, () => {
      this.loadTemplates();
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.RELOAD_LIST_TEMPLATES);
  }

  loadTemplates() {
    this.isLoadingTemplates = true;
    this.sorterTemplateService
      .getIndex()
      .subscribe((res: TemplateSorterModel.ResponseTemplate) => {
        this.isLoadingTemplates = false;
        this.listTemplates = res.data;
      }, async (error) => {
        console.error('Error::Subscribe::sorterTemplateService::getIndex', error);
        this.isLoadingTemplates = false;
        await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar cargar las plantillas disponibles.');
      });
  }

  showMatrixTemplate(template: TemplateSorterModel.Template) {
    this.templateSelected.next(template);
  }

}
