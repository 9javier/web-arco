import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Events} from "@ionic/angular";
import {MatrixSorterModel} from "../../../../../services/src/models/endpoints/MatrixSorter";
import {ZoneSorterModel} from "../../../../../services/src/models/endpoints/ZoneSorter";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";

@Component({
  selector: 'sorter-matrix-emptying',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixEmptyingSorterComponent implements OnInit, OnDestroy {

  @Input() enableZoneSelection: boolean = false;
  @Input() sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[] = [];
  @Input() height: string = null;
  @Input() width: string = null;
  @Output() columnSelected = new EventEmitter();
  @Output() listOfIdsWays:EventEmitter<number[]> = new EventEmitter();
  @Input() borrarList :boolean;

  private listZonesWithColors: ZoneSorterModel.ZoneColor[] = [];
  private isTemplateWithEqualZones: boolean = false;
  flag:boolean;
  public waysSelected: any[] = [];
  private listOfIdsYWays = [];

  constructor(
    private events: Events,
    private sorterProvider: SorterProvider
  ) {
    this.sorterProvider.idZoneSelected = null;
  }

  ngOnInit() {
    this.waysSelected = [];
  }

  ngOnDestroy() {

  }

  getBackground(column: MatrixSorterModel.Column) : string {
    if (column && column.way) {
      let way = null;
      let blueWay = false;
      for(way of this.waysSelected){
        if (column.way.id === way.id) {
          blueWay = true;
        }
      }
      if (blueWay === true) {
        return 'lightskyblue';
      } else if (column.way.templateZone && column.way.templateZone.zones && column.way.templateZone.zones.color) {
        return column.way.templateZone.zones.color.hex;
      }
    } else {
      return '#ffffff';
    }
  }

  getEmptyingType(column: MatrixSorterModel.Column) : string {
    let emptyingType = '';
    if (column.way.manual === 1) {
      emptyingType = 'VM';
    }

    if (column.way.new_emptying != null && column.way.manual !== column.way.new_emptying) {
      if (column.way.new_emptying === 1) {
        emptyingType = 'VM';
      } else {
        emptyingType = '';
      }
    }

    return emptyingType;
  }

  selectWay(column: MatrixSorterModel.Column, iHeight: number, iCol: number, check = false) {
    let wayS = null;
    this.flag = false;
    for (wayS of this.waysSelected) {
      if (wayS === column.way) {
        this.flag = true;
        this.removeItemFromArr(this.waysSelected, wayS);
        this.listaWay(this.waysSelected)
      }
    }
    if (this.flag === false) {
      this.waysSelected.push(column.way);
      this.listaWay(this.waysSelected);
    }

    this.columnSelected.next({column, iHeight, iCol});
    this.listOfIdsWays.next(this.waysSelected.map(x => x.id));
  }

  listaWay(lista:Array<any>){
    if(lista.length === 0){
      this.listZonesWithColors.map(x => x.checks = false);
    }
    this.callLsit(lista);
  }

  private callLsit(lista){
    let numero;
    this.listOfIdsYWays.forEach(x => {
      let id;
      numero = 0;
      lista.forEach(y => {
        if (x.id === y.templateZone.zones.id) {
          if (numero >= x.tot) {
            return;
          } else {
            numero++
          }
          id = x.id;
        }
        x['numero'] = numero;
        if (x['numero'] === x.tot) {
          this.listZonesWithColors.filter(way => way.id === x.id).map(ws => ws.checks = true);
        } else {
          this.listZonesWithColors.filter(way => way.id === x.id).map(ws => ws.checks = false);
        }
      });
    })
  }

  removeItemFromArr( arr, item ) {
    let i = arr.indexOf( item );

    if ( i !== -1 ) {
      arr.splice( i, 1 );
    }
  }

  refresh(){
    this.waysSelected = [];
  }
  send(lista:number[]){
    let n = Array.from(new Set(lista));
    console.log(n);
    this.listOfIdsWays.next(n);
  }

  check(lista:ZoneSorterModel.ZoneColor, isCheckBox = false){
    let xy = this.listOfIdsYWays.filter(x => x.id === lista.id);
    xy = xy.map(x => x.ways)[0].map(w => w.col).map(r => r.way);

    if(this.waysSelected.length > 0){
      let w = [...xy];
      if (!lista.checks){
        w.forEach( t => {
          this.waysSelected = this.waysSelected.filter( tr => tr.id !== t.id);
        });
        this.send(this.waysSelected.map(x => x.id));

      }else {
        this.waysSelected.forEach(f => {
          w = w.filter(t => t.id !== f.id);
        });
        this.waysSelected.push(...w)
        this.send(this.waysSelected.map(x => x.id));
      }
    }else{
      this.waysSelected = [...xy];
      console.log(this.waysSelected);
      this.send(this.waysSelected.map(x => x.id));
    }

    let newList = this.sorterTemplateMatrix.map((x,i) => x.columns.map((y,is) => ({way:y.way.templateZone.zones.id,index:is,indexx:i,column:y})));
    newList.forEach(ele => {
      ele = ele.filter(x => x.column.way.templateZone.zones.color.hex === lista.color);
      if(ele.length !== 0){
        ele.forEach(w => {
          this.columnSelected.next({column:w.column,iHeight:w.indexx,iCol:w.index, isCheckBox})
        });
      }
    });
  }


  private checkListas(lista: MatrixSorterModel.MatrixTemplateSorter[] ){
    let list :MatrixSorterModel.MatrixTemplateSorter;
    let col ;
    let idslenght = {};
    let listaIds = [];
    let pset = new Set();
    for(list of lista){
      for (col of list.columns){
        idslenght = {
          idZona:col.way.templateZone.zones.id,
          listas:[col.way.id],
          col
        };

        pset.add(col.way.templateZone.zones.id);
        listaIds.push(idslenght);
      }
    }
    let newList= Array.from(pset);
    let listanew = [];
    let listanew2 = [];
    newList.forEach(x =>{
      listanew = listaIds.filter(xs => xs.idZona === x);
      listanew2.push({x,listanew,num:listanew.length})
    });
    listanew2 = listanew2.map(x => ({id:x.x,ways:x.listanew,tot:x.num}))
    this.listOfIdsYWays = listanew2;
  }

  public loadNewMatrix(newMatrix: MatrixSorterModel.MatrixTemplateSorter[] ) {
    this.sorterTemplateMatrix = newMatrix;
    this.checkListas(newMatrix);
    let savedIds: any = {};
    this.listZonesWithColors = [];

    if (this.sorterTemplateMatrix.length > 0 && this.sorterTemplateMatrix[0].columns.length > 0 && this.sorterTemplateMatrix[0].columns[0].way && this.sorterTemplateMatrix[0].columns[0].way.templateZone && this.sorterTemplateMatrix[0].columns[0].way.templateZone.template) {
      this.isTemplateWithEqualZones = this.sorterTemplateMatrix[0].columns[0].way.templateZone.template.equalParts;
    }

    for (let template of this.sorterTemplateMatrix) {
      for (let column of template.columns) {
        if (column.way) {
          if (column.way.templateZone) {
            let zone = column.way.templateZone;
            if (!savedIds[zone.zones.id]) {
              savedIds[zone.zones.id] = 'ok';
              this.listZonesWithColors.push({
                id: zone.zones.id,
                name: zone.zones.name,
                active: zone.zones.active,
                color: zone.zones.color.hex,
                checks : false,

              });
            }
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
          checks :false
        })
      }
    }
  }

  public changeEmptyingForWay(newEmptying: number, iHeight: number, iCol: number) {
    this.listZonesWithColors.map(x => x.checks = false);
    this.sorterTemplateMatrix[iHeight].columns[iCol].way.new_emptying = newEmptying;
  }
}
