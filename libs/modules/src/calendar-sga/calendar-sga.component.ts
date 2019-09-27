import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatePickerComponent, IDatePickerConfig } from 'ng2-date-picker';
import { CalendarService, CalendarModel, IntermediaryService, WarehouseModel, GroupModel } from '@suite/services';
import { ModalController, AlertController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import * as _ from 'lodash';

@Component({
  selector: 'suite-calendar-sga',
  templateUrl: './calendar-sga.component.html',
  styleUrls: ['./calendar-sga.component.scss']
})
export class CalendarSgaComponent implements OnInit {

  @ViewChild(DatePickerComponent) datePicker:DatePickerComponent;

  public templates:Array<CalendarModel.Template> = [];
  public warehousesOriginList:Array<WarehouseModel.Warehouse> = [];
  public warehousesOriginDestinationList: any = []; //para guardar los posibles destinos de cada origen
  public warehousesDestinationList: any = [];
  public templateBase:Array<CalendarModel.TemplateWarehouse> = [];
  public cantDates: boolean = false;

  public calendarConfiguration:IDatePickerConfig  = {
    closeOnSelect:false,
    allowMultiSelect:true,
    hideOnOutsideClick:false,
    appendTo:'.append',
    drops:'down',
    firstDayOfWeek: 'mo'
  } 

  public selectDates:Array<{date:string;warehouses:Array<CalendarModel.TemplateWarehouse>;value:any}> = [{
    date:'todas las fechas seleccionadas',
    warehouses:[],
    value:null
  }];
  public date:{date:string;warehouses:Array<CalendarModel.TemplateWarehouse>;value:any};
  public dates: any;

  constructor(
    private calendarService: CalendarService,
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private alertController:AlertController,
    private changeDetectorRef:ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getBase();
    this.getTemplates();
    this.getCalendarDates();
    
    this.datePicker.onLeftNav.subscribe(changes=>{
      this.getCalendarDates();
    });

    this.datePicker.onRightNav.subscribe(changes=>{
      this.getCalendarDates();
    });

    this.datePicker.onGoToCurrent.subscribe(changes=>{
      this.getCalendarDates();
    });

    this.datePicker.onSelect.subscribe((changes)=>{
        this.cantDates = false;
        let selectDates = this.dates.map(_=>{
          return _.format("YYYY-MM-DD");
        });
        let auxDates = [{
          date:'todas las fechas seleccionadas',
          warehouses:[],
          value:null
        }];
        selectDates.forEach(date=>{
          let aux = this.selectDates.find(_date=>{return (_date.date == date)});
          if(!aux){
            auxDates.push(
              {
                date:date,
                warehouses:[],
                value:null
              }
            );
          }else{
            auxDates.push(aux)
          }
          this.getCalendarDates();
          this.cantDates = true;
        })
        this.getCalendarDates();
        this.selectDates = auxDates;
        this.changeDetectorRef.detectChanges();
        this.intermediaryService.presentLoading();
        this.calendarService.getTemplatesByDate(selectDates).subscribe(templates=>{
          templates.forEach(template=>{
            this.selectDates.forEach(date=>{
              if(template.date == date.date){
                date.warehouses = template.warehouses;
              }
            });
          });
          let equals = true;
          for(let i = 1; i < this.selectDates.length; i++) {
            for(let j = 0; j < this.selectDates[i].warehouses.length; j++) {
              if(i+1 <= this.selectDates.length && this.selectDates[i+1]) {
                if(this.selectDates[i].warehouses.length == this.selectDates[i+1].warehouses.length){
                  if(_.isEqual(this.selectDates[i].warehouses[j].originWarehouse, this.selectDates[i+1].warehouses[j].originWarehouse)) {
                    let currentWarehouses = this.selectDates[i].warehouses[j].destinationsWarehouses;
                    let nextWarehouses = this.selectDates[i+1].warehouses[j].destinationsWarehouses;
                    if(currentWarehouses.length == nextWarehouses.length) {
                      for(let k = 0; k < currentWarehouses.length; k++) {
                        if(!_.isEqual(currentWarehouses[k].destinationWarehouse, nextWarehouses[k].destinationWarehouse)) {
                          equals = false;
                        }
                      }
                    } else { equals = false; }
                  } else { equals = false; }
                } else {equals = false; }
              }
            }
          }
          
          if(equals && this.selectDates.length != 1) {
            this.setWarehousesOfDate(this.selectDates[1].warehouses, true);
          } else if(this.selectDates.length != 1){
            this.setWarehousesOfDate(this.selectDates[1].warehouses, false);
          }

          this.date = auxDates[0];
          this.manageSelectedClass();
          this.intermediaryService.dismissLoading();
        },()=>{
          this.intermediaryService.dismissLoading();
        })
      })
  }

  /**
   * Set warehouses by date
   */

  setWarehousesOfDate(selectDateWarehouses, valueDate: boolean) {
    this.warehousesDestinationList.forEach(val => {
      val.destinos = [],
      val.destinos_label = ''
    });

    selectDateWarehouses.forEach(warehouse => {
      warehouse.destinationsWarehouses.forEach(destination => {
          this.warehousesDestinationList.forEach(val2 => {
            if(val2.id === warehouse.originWarehouse.id){
              if(valueDate) {
                val2.destinos.push({
                  id: destination.destinationWarehouse.id,
                  name: destination.destinationWarehouse.name
                });
                if(val2.destinos_label != '')
                  val2.destinos_label += ', '+destination.destinationWarehouse.name;
                else
                  val2.destinos_label = destination.destinationWarehouse.name
              }               
            }
          });
        });
      });
    this.sortByDestinations();
  }

  /** construir calendario */

  /**
   * Obtener todas las fechas
   */
  getCalendarDates():void{
    this.calendarService.getCalendarDates().subscribe(dates=>{
      this.manageHaveClass(dates);
    });
  }

  manageHaveClass(dates:Array<string>):void{
    let days = <any>document.getElementsByClassName("dp-calendar-day");
    for(let i=0;i<days.length;i++){
      let day = days[i];
      dates.forEach(date=>{
        if(date.split("-").reverse().join("-") == day.dataset.date){
          day.className+= ' haveDate'; 
        }
      });
    }
  }

  /**
   * Obtain the stored templates
   */
  getTemplates():void{
    this.calendarService.getTemplates().subscribe(templates=>{
      this.templates = templates;
    });
  }

  /**
   * Get the base template skeleton to show
   */
  getBase():void{
    this.intermediaryService.presentLoading();
    this.calendarService.getBaseBad().subscribe(warehouses=>{
      //console.log(warehouses);
      this.intermediaryService.dismissLoading();
      this.templateBase = warehouses;
      warehouses.forEach(origin => {
        this.warehousesOriginList.push(origin.originWarehouse);
        this.warehousesOriginDestinationList.push({
          idOrigen: origin.originWarehouse.id,
          destinations: origin.destinationsWarehouses
        });
        this.warehousesDestinationList.push({
          id: origin.originWarehouse.id,
          destinos: [],
          destinos_label: ''
        })
      });
    },()=>{
      this.intermediaryService.dismissLoading();
    })
  }
  
  /**
   * Guardar destino
   */
  async store(idOrigin: number){
    var destinos = [];
    var destinations = [];
    this.warehousesDestinationList.forEach(val => {
      if(val.id === idOrigin){
        destinos.push(val.destinos);
      }
    });
    this.warehousesOriginDestinationList.forEach(val => {
      if(val.idOrigen === idOrigin){
        destinations.push(val.destinations);
      }
    });
    let modal = (await this.modalController.create({
      component: StoreComponent,
      componentProps: {
        originDestinations: destinations,
        destinos: destinos
      }
    }));
    modal.onDidDismiss().then((data)=>{
      this.intermediaryService.presentLoading();
      var dataInfo: any = data;
      if(dataInfo.data !== undefined){
        this.warehousesDestinationList.forEach(val => {
          if(val.id === idOrigin){
            val.destinos = new Array;
            val.destinos_label = '';
          }
        });
        dataInfo.data.listDestinos.forEach(destino => {
          this.warehousesDestinationList.forEach(val2 => {
            if(val2.id === idOrigin){
              val2.destinos.push({
                id: destino.id,
                name: destino.name
              });
              if(val2.destinos_label != '')
                val2.destinos_label += ', '+destino.name;
              else
                val2.destinos_label = destino.name
            }
          });
        });

        this.selectDates.forEach((date,i)=>{
          if(i==0)
            return false;   
          date.warehouses = this.addWarehouses();
        });

        this.sortByDestinations();
      }
      this.intermediaryService.dismissLoading();
    })
    modal.present();
  }

  /**
   * Seleccionar plantilla
   * @param template
   */
  selectTemplate(template: CalendarModel.Template){
    this.intermediaryService.presentLoading();
    this.warehousesDestinationList.forEach(val => {
      val.destinos = [],
      val.destinos_label = ''
    });

    var warehouses = template.warehouses;
    warehouses.forEach(warehouse => {
      this.warehousesDestinationList.forEach(destination => {
        if(destination.id === warehouse.originWarehouse.id){
          warehouse.destinationsWarehouses.forEach(destinationFinal => {
            destination.destinos.push({
              id: destinationFinal.destinationWarehouse.id,
              name: destinationFinal.destinationWarehouse.name
            });
            if(destination.destinos_label != '')
              destination.destinos_label += ', '+destinationFinal.destinationWarehouse.name;
            else
              destination.destinos_label = destinationFinal.destinationWarehouse.name
          });
        }
      });
    });

    this.manageSelectedClass();
    this.sortByDestinations();

    this.intermediaryService.dismissLoading();
  }

  async sortByDestinations(){
    // ordenar por tamaño destinos
    this.warehousesDestinationList.sort((unaCadena, otraCadena) => otraCadena.destinos.length - unaCadena.destinos.length);
    
    var tempOrigin = [];
    this.warehousesDestinationList.forEach(destination => {
      this.warehousesOriginList.forEach(origin => {
        if(destination.id === origin.id){
          tempOrigin.push(origin);
        }
      });
    });

    this.warehousesOriginList = [];
    this.warehousesOriginList = tempOrigin;

    this.manageSelectedClass();
  }

  /**
   * Store a new template
   * @param template - the template to save
   */
  async storeTemplate(){

    var template: CalendarModel.SingleTemplateParams = {
      name: '',
      warehouses: this.addWarehouses()
    };
    const prompt = await this.alertController.create({
      message:'Inserte el nombre de la plantilla',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre'
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            template.name = data.name;
            this.intermediaryService.presentLoading();
            this.calendarService.storeTemplate(template).subscribe(()=>{
              this.clear();
              this.getCalendarDates();
              this.intermediaryService.presentToastSuccess("Plantilla guardada con éxito");
              this.getTemplates();
              this.intermediaryService.dismissLoading();
            },()=>{
              this.intermediaryService.presentToastError("Error al guardar, intente más tarde");
              this.intermediaryService.dismissLoading();
            });
          }
        }
      ]
    });

    await prompt.present();

  }

  clear(){
    this.warehousesOriginList.sort((unaCadena, otraCadena) => unaCadena.id - otraCadena.id);

    this.warehousesDestinationList.forEach(val => {
      val.destinos = [],
      val.destinos_label = ''
    });

    var tempDestination = [];
    this.warehousesOriginList.forEach(origin => {
      this.warehousesDestinationList.forEach(destination => {
        if(destination.id === origin.id){
          tempDestination.push(destination);
        }
      });
    });

    this.warehousesDestinationList = [];
    this.warehousesDestinationList = tempDestination;

    this.selectDates = [{
      date:'todas las fechas seleccionadas',
      warehouses:[],
      value:null
    }];

    this.manageSelectedRadio();
    this.manageSelectedClass();
    this.getCalendarDates();
    this.dates = [];
    this.cantDates = false;
  }

  addWarehouses(): any[]{
    var warehouses: any = [];

    this.warehousesDestinationList.forEach(val => {
      if(val.destinos.length > 0){
        warehouses.push({
          originWarehouseId: val.id,
          destinationWarehouseIds: (val.destinos.map(warehouse=>warehouse.id))
        });
      }
    });

    return warehouses;
  }
  

  /**
   * Store new ????
   */
  storeDate():void{
    let globalValues = {
      calendars:[]
    }
    this.selectDates.forEach((date,i)=>{
      if(i==0)
        return false;
      var value = {
        date: '',
        warehouses: []
      };

      if(this.date.date != 'todas las fechas seleccionadas')
        value.warehouses = this.addWarehouses();
      else
        value.warehouses = this.addWarehouses();
      value.date = date.date;
      if(value.warehouses.length)
        globalValues.calendars.push(value)
    });
    
    this.intermediaryService.presentLoading();
    this.calendarService.store(globalValues).subscribe(()=>{
      this.clear()
      this.intermediaryService.presentToastSuccess("Guardado con éxito");
      this.intermediaryService.dismissLoading();
      this.getCalendarDates();
    },(error)=>{
      this.intermediaryService.presentToastError("Error al guardar, intente más tarde");
      this.intermediaryService.dismissLoading();
    });
    // console.log(globalValues);
  }

  manageSelectedClass():void{
    let days = <any>document.getElementsByClassName("dp-calendar-day");
    for(let i=0;i<days.length;i++){
      let day = days[i];
      this.selectDates.forEach(date=>{
        if(date.date.split("-").reverse().join("-") == day.dataset.date){
          if((date.warehouses.length) || (date.date && this.addWarehouses().length)){
            day.className+= ' tselected'; 
          }else{
            // console.log("borrando")
            day.className = day.className.replace(/tselected/g, "");
          }
        } 
      });
    }
  }

  manageSelectedRadio():void{
    let days = <any>document.getElementsByClassName("dp-selected");
    for(let i=0;i<days.length;i++){
      let day = days[i];
      day.className = day.className.replace(/dp-selected/g, "");
    }
  }

  /**
   * Tells if all dates have selected warehouses
   * @returns status of submit
   */
  validToStore(){
    let flag = true;
    if(this.date.date == 'todas las fechas seleccionadas' && this.addWarehouses().length )
      return true;
    this.selectDates.forEach((date,i)=>{
      if(!i)
        return true;
      if(!(date.warehouses.length || (date.value && this.addWarehouses().length)))
        flag = false;
    });
    return flag;
  }

  /**
   * Eliminar la plantila
   * @param idTemplate de la plantilla a eliminar
   */

   async deleteTemplate(idTemplate){
    const prompt = await this.alertController.create({
      message:'¿Seguro desea eliminar la plantilla?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.intermediaryService.presentLoading();
            this.calendarService.deleteTemplate(idTemplate).subscribe(template=>{
              this.intermediaryService.presentToastSuccess("Plantilla eliminada con éxito");
              this.intermediaryService.dismissLoading();
              this.templates = [];
              this.clear();
              this.getTemplates();
            },()=>{
              this.intermediaryService.presentToastError("Error al eliminar, intente más tarde");
              this.intermediaryService.dismissLoading();
            });
          }
        }
      ]
    });

    await prompt.present();
    
   }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.datePicker.api.open();
    // console.log(this.datePicker);
  }


}
