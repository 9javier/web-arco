import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Events} from "@ionic/angular";
import {ZoneSorterModel} from "../../../../../services/src/models/endpoints/ZoneSorter";
import {MatrixSorterModel} from "../../../../../services/src/models/endpoints/MatrixSorter";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";

@Component({
  selector: 'sorter-matrix-output',
  templateUrl: './matrix-output.component.html',
  styleUrls: ['./matrix-output.component.scss']
})
export class MatrixOutputSorterComponent implements OnInit, OnDestroy {

  @Output() waySelected = new EventEmitter();

  sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[] = [];

  private listZonesWithColors: ZoneSorterModel.ZoneColor[] = [];
  private isTemplateWithEqualZones: boolean = false;
  private columnWaySelected: MatrixSorterModel.Column = null;

  constructor(
    private events: Events,
    private sorterProvider: SorterProvider
  ) {
    this.sorterProvider.idZoneSelected = null;
  }
  
  ngOnInit() {

  }

  ngOnDestroy() {

  }

  public processMatrix(newMatrix: MatrixSorterModel.MatrixTemplateSorter[]) {
    this.sorterTemplateMatrix = newMatrix;

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
              color: zone.zones.color.hex
            });
          }
        }
      }
    }
  }

  getBackgroundForSelected(column: MatrixSorterModel.Column) : string {
    if (column && column.way && column.way.templateZone && column.way.templateZone.zones && column.way.templateZone.zones.color) {
      return column.way.templateZone.zones.color.hex;
    } else {
      return '#ffffff';
    }
  }

  isWaySelected(column: MatrixSorterModel.Column) : boolean {
    return this.columnWaySelected && this.columnWaySelected.way.id == column.way.id;
  }

  resetWaySelected() {
    this.columnWaySelected = null;
  }

  selectWay(column: MatrixSorterModel.Column) {
    let waySelected = null;
    if (column.way.manual && column.way.qty_products > 0) {
      this.columnWaySelected = column;
      waySelected = this.columnWaySelected.way;
    } else {
      this.columnWaySelected = null;
      waySelected = null;
    }
    this.waySelected.next(waySelected);
  }
}
