import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'suite-matrix-select-way-sorter',
  templateUrl: './matrix-select-way-sorter.component.html',
  styleUrls: ['./matrix-select-way-sorter.component.scss']
})
export class MatrixSelectWaySorterComponent implements OnInit {

  @Input() waysMatrix: any = [];

  data = [];
  dataSource = new MatTableDataSource<Element>(this.data);

  public contZone: any = [];
  public selectWay: any = [{
    height: 0,
    columns: []
  }];
  public dataPriorities: any = [];
  public zoneSelect: any = {};

  displayedData = ['prioridad', 'carril'];
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  showExpasion: boolean = false;

  constructor() { 
  }

  ngOnInit() {
    this.waysMatrix.forEach(way => {
      var dataColumns = [];
      console.log(way);
      way.columns.forEach(column => {
        var dataColumn = {
          column: '',
          ways_number: '',
          zone: '',
          color: ''
        };
        dataColumn.column = column.column;
        dataColumn.ways_number = column.ways_number;
        if(column.way.templateZone !== null){
          dataColumn.zone = column.way.templateZone.zones.id;
          dataColumn.color = column.way.templateZone.zones.color.hex;
        } else {
          dataColumn.zone = '';
          dataColumn.color = '';
        }
        dataColumns.push(dataColumn);
      });
      this.selectWay.push({
        height: way.height,
        columns: dataColumns
      })
    });
  }

  getColumn(waySelect): void {
    if(this.zoneSelect !== {}){
      this.selectWay.forEach(way => {
        way.columns.forEach(column => {
          if(column.ways_number === waySelect.ways_number){
            if(column.zone === '' && column.color === ''){
              column.zone = this.zoneSelect.id;
              column.color = this.zoneSelect.color.hex;
              if(this.dataPriorities.length > 0){
                var bandZone = false;
                this.dataPriorities.forEach(zone => {
                  if(zone.zone === column.zone){
                    bandZone = true;
                    this.contZone.forEach(cz => {
                      if(cz.zone === column.zone){
                        cz.cont ++;
                        zone.ways.push({
                          waysId: column.ways_number,
                          priority: cz.cont
                        });
                      }
                    });
                  }
                });
                if(!bandZone){
                  this.dataPriorities.push({
                    zone: column.zone,
                    ways: [{
                      waysId: column.ways_number,
                      priority: 1
                    }]
                  });
                  this.contZone.push({
                    zone: column.zone,
                    cont: 1
                  });
                }
              } else {
                this.dataPriorities.push({
                  zone: column.zone,
                  ways: [{
                    waysId: column.ways_number,
                    priority: 1
                  }]
                });
                this.contZone.push({
                  zone: column.zone,
                  cont: 1
                });
              }
            } else{
              if(column.zone === this.zoneSelect.id && column.color === this.zoneSelect.color.hex){
                this.dataPriorities.forEach(zone => {
                  if(zone.zone === column.zone){
                    this.contZone.forEach(cz => {
                      if(cz.zone === column.zone){
                        cz.cont --;
                        var position = -1;
                        zone.ways.forEach((way, index, array) => {
                          if(way.waysId === column.ways_number){
                            position = index;
                          }
                          if(position !== -1){
                            way.priority --;
                          }
                        });
                        if(position !== -1)
                          zone.ways.splice(position, 1);
                      }
                    });
                  }
                });
                column.zone = '';
                column.color = '';
              } else {
                var zoneDelete = -1;
                this.dataPriorities.forEach(zone => {
                  var position = -1;
                  zone.ways.forEach((way, index, array) => {
                    if(way.waysId === column.ways_number){
                      position = index;
                      zoneDelete = zone.zone;
                    }
                    if(position !== -1){
                      way.priority --;
                    }
                  });
                  if(position !== -1)
                    zone.ways.splice(position, 1);
                });
                if(zoneDelete !== -1){
                  this.contZone.forEach(cz => {
                    if(cz.zone === zoneDelete){
                      cz.cont --;
                    }
                  });
                }
                column.zone = this.zoneSelect.id;
                column.color = this.zoneSelect.color.hex;
                var bandZone = false;
                this.dataPriorities.forEach(zone => {
                  if(zone.zone === column.zone){
                    bandZone = true;
                    this.contZone.forEach(cz => {
                      if(cz.zone === column.zone){
                        cz.cont ++;
                        zone.ways.push({
                          waysId: column.ways_number,
                          priority: cz.cont
                        });
                      }
                    });
                  }
                });
                if(!bandZone){
                  this.dataPriorities.push({
                    zone: column.zone,
                    ways: [{
                      waysId: column.ways_number,
                      priority: 1
                    }]
                  });
                  this.contZone.push({
                    zone: column.zone,
                    cont: 1
                  });
                }
              }
            }
          }
        });
      });
      this.data = [];
      this.dataPriorities.forEach(prioriti => {
        prioriti.ways.forEach(way => {
          this.data.push({
            waysId: way.waysId,
            priority: way.priority
          })
        });
      });

      this.dataSource = new MatTableDataSource<Element>(this.data);
    }
  }

  changeZone(element){
    this.zoneSelect = element;
  }

}

export class ExampleDataSource2 extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */

  connect(): Observable<Element[]> {
    const rows = [];
    return of(rows);
  }


  disconnect() { }

  addCarriles() {
    //console.log("aqui")
  }
}