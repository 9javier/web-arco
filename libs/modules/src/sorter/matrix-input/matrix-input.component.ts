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
  private listColors: string[] = [];

  constructor(
    private events: Events
  ) { }
  
  ngOnInit() {
    this.listColors = [
      '#b388ff',
      '#ccff90',
      '#ff9e80',
      '#ea80fc',
      '#a7ffeb',
      '#ffd180',
      '#82b1ff',
      '#ffe57f',
      '#ff80ab',
      '#f4ff81',
      '#b9f6ca',
      '#8c9eff',
      '#84ffff',
      '#ffff8d',
      '#ff8a80',
      '#80d8ff',
  ];

    this.events.subscribe(this.DRAW_TEMPLATE_MATRIX, (sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[]) => {
      this.sorterTemplateMatrix = sorterTemplateMatrix;

      let savedIds: any = {};
      this.listZonesWithColors = [];

      let iColorToZone = 0;
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
                color: this.listColors[iColorToZone]
              });
              iColorToZone++;
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
    if (column.way && column.way.templateZone){
      let zoneColor = this.listZonesWithColors.find(zone => zone.id == column.way.templateZone.zones.id);
      return zoneColor.color;
    }
    return '#ffffff';
  }
}
