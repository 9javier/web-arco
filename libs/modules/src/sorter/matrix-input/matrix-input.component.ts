import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatrixSorterModel} from "../../../../services/src/models/endpoints/MatrixSorter";
import {ZoneSorterModel} from "../../../../services/src/models/endpoints/ZoneSorter";
import {Events} from "@ionic/angular";
import {SorterProvider} from "../../../../services/src/providers/sorter/sorter.provider";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sorter-matrix-input',
  templateUrl: './matrix-input.component.html',
  styleUrls: ['./matrix-input.component.scss']
})
export class MatrixInputSorterComponent implements OnInit, OnDestroy {

  private DRAW_TEMPLATE_MATRIX: string = 'draw_template_matrix';

  @Input() enableZoneSelection: boolean = false;
  @Output() zoneSelected = new EventEmitter();

  sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[] = [];
  private listZonesWithColors: ZoneSorterModel.ZoneColor[] = [];
  private isTemplateWithEqualZones: boolean = false;

  constructor(
    private events: Events,
    private sorterProvider: SorterProvider
  ) {
    this.sorterProvider.idZoneSelected = null;
  }

  ngOnInit() {
    this.events.subscribe(this.DRAW_TEMPLATE_MATRIX, (sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[]) => {
      this.sorterTemplateMatrix = sorterTemplateMatrix;

      let savedIds: any = {};
      this.listZonesWithColors = [];

      if (this.sorterTemplateMatrix.length > 0 && this.sorterTemplateMatrix[0].columns.length > 0 && this.sorterTemplateMatrix[0].columns[0].way && this.sorterTemplateMatrix[0].columns[0].way.templateZone && this.sorterTemplateMatrix[0].columns[0].way.templateZone.template) {
        this.isTemplateWithEqualZones = this.sorterTemplateMatrix[0].columns[0].way.templateZone.template.equalParts;
      }

      for (let template of this.sorterTemplateMatrix) {
        for (let column of template.columns) {
          if (column.way && column.way.templateZone) {
            let zone = column.way.templateZone;
            if (!savedIds[zone.zones.id]) {
              savedIds[zone.zones.id] = 'ok';
              this.listZonesWithColors.push({
                id: zone.zones.id,
                name: zone.zones.name,
                active: zone.zones.active,
                color: zone.zones.color.hex,
                checks:false
              });
            }
          }
        }
      }
      if (this.listZonesWithColors.length > 0) {
        if (this.enableZoneSelection && this.isTemplateWithEqualZones) {
          this.listZonesWithColors.unshift({
            id: 0,
            name: 'Zona seleccionada',
            active: true,
            color: '#87CEFA',
            checks:false
          })
        }
      }
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.DRAW_TEMPLATE_MATRIX);
  }

  getBackgroundForSelected(column: MatrixSorterModel.Column) : string {
    if (column && column.way && column.way.templateZone && column.way.templateZone.zones && column.way.templateZone.zones.color) {
      return column.way.templateZone.zones.color.hex;
    } else {
      return '#ffffff';
    }
  }

  isFromSelectedZone(column: MatrixSorterModel.Column) : boolean {
    if (this.sorterProvider.idZoneSelected) {
      if (column.way && column.way.templateZone && column.way.templateZone.zones && this.sorterProvider.idZoneSelected === column.way.templateZone.zones.id) {
        if (this.sorterProvider.idZoneSelected === column.way.templateZone.zones.id) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  selectZone(column: MatrixSorterModel.Column) {
    if (this.enableZoneSelection && this.isTemplateWithEqualZones) {
      this.zoneSelected.next(column.way.templateZone.zones.id);
    }
  }
}
