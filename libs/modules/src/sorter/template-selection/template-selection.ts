import {Component, OnDestroy, OnInit} from '@angular/core';
import {Events} from "@ionic/angular";
import {SorterService} from "../../../../services/src/lib/endpoint/sorter/sorter.service";
import {SorterModel} from "../../../../services/src/models/endpoints/Sorter";
import {TemplateSorterModel} from "../../../../services/src/models/endpoints/TemplateSorter";
import {ExecutionSorterModel} from "../../../../services/src/models/endpoints/ExecutionSorter";
import {SorterExecutionService} from "../../../../services/src/lib/endpoint/sorter-execution/sorter-execution.service";
import {IntermediaryService} from "@suite/services";
import {SorterProvider} from "../../../../services/src/providers/sorter/sorter.provider";
import {HttpRequestModel} from "../../../../services/src/models/endpoints/HttpRequest";

@Component({
  selector: 'suite-sorter-template-selection',
  templateUrl: './template-selection.html',
  styleUrls: ['./template-selection.scss']
})
export class TemplateSelectionComponent implements OnInit, OnDestroy {

  private LOAD_MATRIX_TEMPLATE: string = 'load_matrix_template';
  private RELOAD_LIST_TEMPLATES: string = 'reload_list_templates';

  private idSorter: number = null;
  private idLastTemplateOpen: number = null;

  constructor(
    private events: Events,
    private intermediaryService: IntermediaryService,
    private sorterService: SorterService,
    private sorterExecutionService: SorterExecutionService,
    private sorterProvider: SorterProvider
  ) { }

  ngOnInit() {
    this.sorterService
      .getFirstSorter()
      .subscribe((res: SorterModel.FirstSorter) => {
        this.idSorter = res.id;
      });
  }

  ngOnDestroy() {
    this.sorterProvider.idTemplateSelected = null;
  }

  selectionOfTemplate(data) {
    if (data.id != this.idLastTemplateOpen) {
      this.idLastTemplateOpen = data.id;
      this.sorterProvider.idTemplateSelected = this.idLastTemplateOpen;
      this.events.publish(this.LOAD_MATRIX_TEMPLATE, {sorter: this.idSorter, template: data});
    }
  }

  async applyTemplate(data) {
    let template: TemplateSorterModel.Template = data;
    if (!template) {
      await this.intermediaryService.presentWarning('¡La plantilla que intenta aplicar no tiene las zonas definidas! <br/> Cree sus zonas para aplicar la plantilla al sorter.', null);
    } else if (template && (template.zones.length < 1 || template.zoneWays.length < 1 || template.zoneWarehouses.length < 1)) {
      let elementsToDefine = '';
      if (template.zones.length < 1) {
        elementsToDefine += '<li>Zonas</li>';
      }
      if (template.zoneWays.length < 1) {
        elementsToDefine += '<li>Calles por zona</li>';
      }
      if (template.zoneWarehouses.length < 1) {
        elementsToDefine += '<li>Tiendas de destino por calle</li>';
      }
      await this.intermediaryService.presentWarning('¡La plantilla que intenta aplicar no está correctamente definida! <br/> Para poder aplicarla asegúrese de haber asignado sus: <ul>' + elementsToDefine + '</ul>', null);
    } else {
      await this.intermediaryService.presentLoading('Aplicando plantilla...');
      this.sorterExecutionService
        .getChangeExecutionTemplate(template.id)
        .subscribe(async (res: ExecutionSorterModel.ChangeExecutionTemplate) => {
          await this.intermediaryService.dismissLoading();
          await this.intermediaryService.presentToastSuccess(`Se ha aplicado al sorter la plantilla ${template.name}.`, 1500);
          this.events.publish(this.RELOAD_LIST_TEMPLATES);
        }, async (error: HttpRequestModel.Error) => {
          await this.intermediaryService.dismissLoading();
          if (error.error.code == 405) {
            await this.intermediaryService.presentToastError(`La plantilla ${template.name} ya está aplicada al sorter actualmente.`, 1500);
          } else {
            let errorMessage = `Ha ocurrido un error al intentar aplicar la plantilla ${template.name}.`;
            if (error.error && error.error.errors) {
              errorMessage = error.error.errors;
            }
            await this.intermediaryService.presentToastError(errorMessage, 2000);
          }
        });
    }
  }

}
