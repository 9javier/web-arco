import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatrixSorterModel} from "../../../../services/src/models/endpoints/MatrixSorter";
import {ZoneSorterModel} from "../../../../services/src/models/endpoints/ZoneSorter";
import {Events} from "@ionic/angular";

@Component({
  selector: 'sorter-matrix-input',
  templateUrl: './matrix-input.component.html',
  styleUrls: ['./matrix-input.component.scss']
})
export class MatrixInputSorterComponent implements OnInit, OnDestroy {

  private DRAW_TEMPLATE_MATRIX: string = 'draw_template_matrix';

  sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[] = [];
  private listZonesWithColors: ZoneSorterModel.ZoneColor[] = [];

  constructor(
    private events: Events
  ) { }
  
  ngOnInit() {
    this.events.subscribe(this.DRAW_TEMPLATE_MATRIX, (sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[]) => {
      this.sorterTemplateMatrix = sorterTemplateMatrix;

      let savedIds: any = {};
      this.listZonesWithColors = [];

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
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.DRAW_TEMPLATE_MATRIX);
  }

  getBackgroundForSelected(column: MatrixSorterModel.Column) {
    if (column && column.way && column.way.templateZone && column.way.templateZone.zones && column.way.templateZone.zones.color) {
      return column.way.templateZone.zones.color.hex;
    } else {
      return '#ffffff';
    }
  }
}
