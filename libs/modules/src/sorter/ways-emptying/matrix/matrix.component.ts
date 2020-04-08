import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Events} from "@ionic/angular";
import {MatrixSorterModel} from "../../../../../services/src/models/endpoints/MatrixSorter";
import {ZoneSorterModel} from "../../../../../services/src/models/endpoints/ZoneSorter";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";
import { FormBuilder } from '@angular/forms';
import { element } from 'protractor';
import { ModelModel } from '@suite/services';
import { el } from '@angular/platform-browser/testing/src/browser_util';

@Component({
  // tslint:disable-next-line:component-selector
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
  @Output() loadActiveSorter = new EventEmitter();
  @Output() listOfIdsWays:EventEmitter<number[]> = new EventEmitter();

  private listZonesWithColors: ZoneSorterModel.ZoneColor[] = [];
  private isTemplateWithEqualZones: boolean = false;
  flag:boolean;
  public waySelected: number | null = null;
  public waysSelected: any[] = [];
  private listOfIdsYWays = [];

  private ids = [];
  private listas = [];

  constructor(
    private events: Events,
    private sorterProvider: SorterProvider,
    private fb: FormBuilder
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

  deselectWay(column: MatrixSorterModel.Column) : string {
    if (column && column.way) {
        return column.way.templateZone.zones.color.hex;
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

  selectWay(column: MatrixSorterModel.Column, iHeight: number, iCol: number,check=false) {
    this.longList(column);
    let wayS = null;
    this.flag = false;
    for(wayS of this.waysSelected){

      if(wayS === column.way){
        // console.log('passa di qui');
        this.flag = true;
        this.removeItemFromArr( this.waysSelected, wayS );
        this.listaWay(this.waysSelected)
      }
    }
    if(this.flag === false){
      // console.log('passa di qui');
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
    let xs = lista.map(x => ({id:x.templateZone.zones.id,way:x.id}));
    // console.log({x:lista,y:this.listOfIdsYWays},{xs});
    this.callLsit(lista);
  }

  private longList(list:MatrixSorterModel.Column){
    let xy = this.listOfIdsYWays.filter(x => x.id === list.way.templateZone.zones.id);

    xy = xy.map( f => f.ways.map(c => c.listas));
    let n = xy.length;
    this.listOfIdsYWays.forEach(xc => {


    });
    console.log({ listas:this.listOfIdsYWays,list:xy});
  }

  private callLsit(lista){
    let numero;
    this.listOfIdsYWays.forEach(x => {
      let id;
      numero = 0;
      lista.forEach(y => {
        if(x.id === y.templateZone.zones.id){
          if(numero >= x.tot){
            return;
          }else{
            numero ++
          }
          id = x.id;
          // tslint:disable-next-line:no-unused-expression
          {id: y.templateZone.zones.id;num:numero};
        }
        x['numero']=numero;
        if(x['numero'] === x.tot){
          this.listZonesWithColors.filter(way => way.id === x.id ).map(ws => ws.checks = true);
        }else{
          this.listZonesWithColors.filter(way => way.id === x.id ).map(ws => ws.checks = false);
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
    this.listOfIdsYWays = [];
    this.listas = [];
  }
  send(lista:number[], flag: boolean = false){
    let n = Array.from(new Set(lista));
    console.log(n);
    if(flag) {
      this.loadActiveSorter.next();
    }else{
      this.listOfIdsWays.next(n);
    }
  }

  crearUniq(){
    if(this.waysSelected.length > 0){
      let n = Array.from(new Set(this.waysSelected.map(c => c.id)));
      console.log(n);
      // this.waysSelected = n;

    }
  }

  check(lista:ZoneSorterModel.ZoneColor){
    console.log(lista.checks);
    let xy = this.listOfIdsYWays.filter(x => x.id === lista.id);
    xy = xy.map(x => x.ways)[0].map(w => w.col).map(r => r.way);
    console.log(xy,`lista per ${lista.id}`); // lista per id columna
    if(this.waysSelected.length > 0){
      let ut = this.waysSelected.map(x => x.id);
      let w = [...xy];
      if (!lista.checks){
        // console.log({ut,check:lista.checks,dif:w});
        w.forEach( t => {
          this.waysSelected = this.waysSelected.filter( tr => tr.id !== t.id);
        });
        this.listZonesWithColors.map(c => c.checks = false);
        this.send(this.waysSelected.map(x => x.id), true);
      }else {
        this.waysSelected.forEach(f => {
          w = w.filter(t => t.id !== f.id);
        });
        // console.log(this.waysSelected);
        this.waysSelected.push(...w)
        // console.log(this.waysSelected);
        // console.log({ut,check:lista.checks,dif:w});
        this.send(this.waysSelected.map(x => x.id));
      }

    }else{
      this.waysSelected = [...xy];
      this.send(this.waysSelected.map(x => x.id));
    }
    let newList = this.sorterTemplateMatrix.map((x,i) => x.columns.map((y,is) => ({way:y.way.templateZone.zones.id,index:is,indexx:i,column:y})));
    newList.forEach(ele => {
      ele = ele.filter(x => x.column.way.templateZone.zones.color.hex === lista.color);
      if(ele.length !== 0){
        ele.forEach(w => {
          this.columnSelected.next({column:w.column,iHeight:w.indexx,iCol:w.index})
        });
      }
    });

  }


  private checkListas(lista: MatrixSorterModel.MatrixTemplateSorter[] ){
    // console.log(lista);
    // console.log(this.listZonesWithColors);
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
        }

        pset.add(col.way.templateZone.zones.id);

        listaIds.push(idslenght);
      }
    }
    let newList= Array.from(pset);
    let newOb ={};
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

  public borrarWays(){
    this.refresh();
    this.listZonesWithColors.map(c => c.checks = false);
    this.listZonesWithColors.map(c => c.active = false);
    this.listZonesWithColors.map(c => c.color = '#B388FF');
  }

  public changeEmptyingForWay(newEmptying: number, iHeight: number, iCol: number) {
    this.listZonesWithColors.map(x => x.checks = false);
    this.sorterTemplateMatrix[iHeight].columns[iCol].way.new_emptying = newEmptying;
  }
}
