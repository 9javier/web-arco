import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatePickerComponent, IDatePickerConfig } from 'ng2-date-picker';
import { CalendarService, CalendarModel, IntermediaryService, WarehouseModel, GroupModel } from '@suite/services';
import { ModalController, AlertController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'suite-calendar-sga',
  templateUrl: './calendar-sga.component.html',
  styleUrls: ['./calendar-sga.component.scss']
})
export class CalendarSgaComponent implements OnInit {

  @ViewChild(DatePickerComponent) datePicker: DatePickerComponent;

  public templates: Array<CalendarModel.Template> = [];
  public warehousesOriginList: Array<WarehouseModel.Warehouse> = [];
  public warehousesOriginDestinationList: any = []; //para guardar los posibles destinos de cada origen
  public warehousesDestinationList: any = [];
  public templateBase: Array<CalendarModel.TemplateWarehouse> = [];
  public cantDates: boolean = false;
  private isCheckedOrigin: boolean = false;
  private selectTem: boolean = false;
  private listaFechas:string[] = [];
  private listaFescasDb$:string[];


  public calendarConfiguration: IDatePickerConfig = {
    closeOnSelect: false,
    allowMultiSelect: true,
    hideOnOutsideClick: false,
    appendTo: '.append',
    drops: 'down',
    firstDayOfWeek: 'mo',
    locale: 'es'
  }

  public selectDates: Array<{ date: string; warehouses: Array<CalendarModel.TemplateWarehouse>; value: any }> = [{
    date: 'todas las fechas seleccionadas',
    warehouses: [],
    value: null
  }];
  public date: { date: string; warehouses: Array<CalendarModel.TemplateWarehouse>; value: any };
  public dates: any;

  public listOriginCheck: any = [];
  public selectForm: any;

  constructor(
    private calendarService: CalendarService,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private alertController: AlertController,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.selectForm = this.formBuilder.group({
      isChecked: [false, []],
      origins: new FormArray([])
    });
  }

  ngOnInit() {
    this.getBase();
    this.getTemplates();
    this.getCalendarDates();
    this.changeValues();


    this.datePicker.onLeftNav.subscribe(changes => {
      this.getCalendarDates();
    });

    this.datePicker.onRightNav.subscribe(changes => {
      this.getCalendarDates();
    });

    this.datePicker.onGoToCurrent.subscribe(changes => {
      this.getCalendarDates();
    });

    this.datePicker.onSelect.subscribe((changes) => {
      this.cantDates = false;
      let selectDates = this.dates.map(_ => {

        return _.format("YYYY-MM-DD");
      });
      this.deleteDates(selectDates);

      let auxDates = [{
        date: 'todas las fechas seleccionadas',
        warehouses: [],
        value: null
      }];
      selectDates.forEach(date => {
        // console.log({date});

        let aux = this.selectDates.find(_date => { return (_date.date == date) });
        if (!aux) {
          auxDates.push(
            {
              date: date,
              warehouses: [],
              value: null
            }
          );
        } else {
          auxDates.push(aux)
        }
        this.getCalendarDates();
        this.cantDates = true;
      })
      this.getCalendarDates();
      this.selectDates = auxDates;
      this.changeDetectorRef.detectChanges();
      this.intermediaryService.presentLoading();
      this.calendarService.getTemplatesByDate(selectDates).subscribe(templates => {
        templates.forEach(template => {
          this.selectDates.forEach(date => {
            if (template.date == date.date) {
              date.warehouses = template.warehouses;
            }
          });
        });
        let equals = true;
        for (let i = 1; i < this.selectDates.length; i++) {
          for (let j = 0; j < this.selectDates[i].warehouses.length; j++) {
            if (i + 1 <= this.selectDates.length && this.selectDates[i + 1]) {
              if (this.selectDates[i].warehouses.length == this.selectDates[i + 1].warehouses.length) {
                if (_.isEqual(this.selectDates[i].warehouses[j].originWarehouse, this.selectDates[i + 1].warehouses[j].originWarehouse)) {
                  let currentWarehouses = this.selectDates[i].warehouses[j].destinationsWarehouses;
                  let nextWarehouses = this.selectDates[i + 1].warehouses[j].destinationsWarehouses;
                  if (currentWarehouses.length == nextWarehouses.length) {
                    for (let k = 0; k < currentWarehouses.length; k++) {
                      if (!_.isEqual(currentWarehouses[k].destinationWarehouse, nextWarehouses[k].destinationWarehouse)) {
                        equals = false;
                      }
                    }
                  } else { equals = false; }
                } else { equals = false; }
              } else { equals = false; }
            }
          }
        }

        if (equals && this.selectDates.length != 1) {
          this.setWarehousesOfDate(this.selectDates[1].warehouses, true);
        } else if (this.selectDates.length != 1) {
          this.setWarehousesOfDate(this.selectDates[1].warehouses, false);
        }

        this.addDarkBlueOrRed();


        this.date = auxDates[0];
        this.intermediaryService.dismissLoading();
      }, () => {
        this.intermediaryService.dismissLoading();
      })
    });

    this.selectForm.valueChanges.subscribe((obj) => {
      this.isCheckedOrigin = false;
      obj.origins.forEach(element => {
        if (element) {
          this.isCheckedOrigin = true;
        }
      });
    });
  }

  /**
   * Set warehouses by date
   */

  setWarehousesOfDate(selectDateWarehouses, valueDate: boolean) {


    selectDateWarehouses.forEach(warehouse => {


      warehouse.destinationsWarehouses.forEach(destination => {
        this.warehousesDestinationList.forEach(val2 => {
          if (val2.id === warehouse.originWarehouse.id) {
            if (valueDate) {
              if (!this.warehousesDestinationList.find((data) => {
                let t = false;
                if (data.id == warehouse.originWarehouse.id) {
                  t = data.destinos.find((dt) => { return (dt.id == destination.destinationWarehouse.id) });
                }

                return t ? true : false;
              })) {
                val2.destinos.push({
                  id: destination.destinationWarehouse.id,
                  name: destination.destinationWarehouse.name
                });
                if (val2.destinos_label !== '')
                  val2.destinos_label += ', ' + destination.destinationWarehouse.name;
                else
                  val2.destinos_label = destination.destinationWarehouse.name
              };
            } else {
              val2.destinos = [],
                val2.destinos_label = ''
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
  getCalendarDates(): void {
    this.calendarService.getCalendarDates().subscribe(dates => {
      this.listaFescasDb$ = dates;

      this.manageHaveClass(dates);
    });
  }

  manageHaveClass(dates: Array<string>): void {
    let days = <any>document.getElementsByClassName("dp-calendar-day");
    for (let i = 0; i < days.length; i++) {
      let day = days[i];
      dates.forEach(date => {
        if (date.split("-").reverse().join("-") == day.dataset.date) {
          day.className += ' haveDate';
        }
      });
    }
  }

  /**
   * Obtain the stored templates
   */
  getTemplates(): void {
    this.calendarService.getTemplates().subscribe(templates => {
      this.templates = templates;
    });
  }

  /**
   * Get the base template skeleton to show
   */
  getBase(): void {
    this.intermediaryService.presentLoading();
    this.calendarService.getBaseBad().subscribe(warehouses => {
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
      this.warehousesOriginList.forEach((o, i) => {
        const control = new FormControl();
        (this.selectForm.controls.origins as FormArray).push(control);
      });
    }, () => {
      this.intermediaryService.dismissLoading();
    })
  }

  /**
   * Guardar destino
   */
  async store(idOrigin: number) {

    var destinos = [];
    var destinations = [];
    this.warehousesDestinationList.forEach(val => {
      if (val.id === idOrigin) {
        destinos = val.destinos;
      }
    });
    this.warehousesOriginDestinationList.forEach(val => {
      if (val.idOrigen === idOrigin) {
        destinations = val.destinations;
      }
    });

    let modal = (await this.modalController.create({
      component: StoreComponent,
      componentProps: {
        originDestinations: destinations,
        destinos: destinos
      }
    }));
    modal.onDidDismiss().then((data) => {
      this.intermediaryService.presentLoading();
      var dataInfo: any = data;
      if (dataInfo.data !== undefined) {
        this.warehousesDestinationList.forEach(val => {
          if (val.id === idOrigin) {
            val.destinos = new Array;
            val.destinos_label = '';
          }
        });
        dataInfo.data.listDestinos.forEach(destino => {
          this.warehousesDestinationList.forEach(val2 => {
            if (val2.id === idOrigin) {
              val2.destinos.push({
                id: destino.id,
                name: destino.name
              });
              if (val2.destinos_label != '')
                val2.destinos_label += ', ' + `${destino.reference} ${destino.name}`;
              else
                val2.destinos_label = `${destino.reference} ${destino.name}`
            }
          });
        });

        this.selectDates.forEach((date, i) => {
          if (i == 0)
            return false;
          date.warehouses = this.addWarehouses();
        });

        this.sortByDestinations();
      }
      this.intermediaryService.dismissLoading();
      this.manageSelectedClass();
    })
    modal.present();
  }

  /**
   * Seleccionar plantilla
   * @param template
   */
  selectTemplate(template: CalendarModel.Template) {
    this.selectTem = true;
    this.intermediaryService.presentLoading();

    this.warehousesDestinationList.forEach(val => {
      val.destinos = [],
        val.destinos_label = ''
    });



    var warehouses = template.warehouses;
    warehouses.forEach(warehouse => {
      this.warehousesDestinationList.forEach(destination => {
        if (destination.id === warehouse.originWarehouse.id) {
          warehouse.destinationsWarehouses.forEach(destinationFinal => {
            var band = false;
            destination.destinos.forEach(des => {
              if (des.id === destinationFinal.destinationWarehouse.id)
                band = true;
            });
            if (!band) {
              destination.destinos.push({
                id: destinationFinal.destinationWarehouse.id,
                name: destinationFinal.destinationWarehouse.name
              });
              if (destination.destinos_label != '')
                destination.destinos_label += ', ' + destinationFinal.destinationWarehouse.name;
              else
                destination.destinos_label = destinationFinal.destinationWarehouse.name;
            }
          });
        }
      });
    });

    this.addDarkBlueOrRed();

    //this.manageSelectedClass();
    this.sortByDestinations();
    this.selectForm.get("isChecked").setValue(false);
    this.intermediaryService.dismissLoading();

  }

  async sortByDestinations() {
    // ordenar por tamaño destinos
    this.warehousesDestinationList.sort((unaCadena, otraCadena) => otraCadena.destinos.length - unaCadena.destinos.length);

    var tempOrigin = [];
    this.warehousesDestinationList.forEach(destination => {
      this.warehousesOriginList.forEach(origin => {
        if (destination.id === origin.id) {
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
  async storeTemplate() {

    var template: CalendarModel.SingleTemplateParams = {
      name: '',
      warehouses: this.addWarehouses()
    };
    const prompt = await this.alertController.create({
      message: 'Inserte el nombre de la plantilla',
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
            this.calendarService.storeTemplate(template).subscribe(() => {
              this.clear();
              this.getCalendarDates();
              this.intermediaryService.presentToastSuccess("Plantilla guardada con éxito");
              this.getTemplates();
              this.intermediaryService.dismissLoading();
            }, () => {
              this.intermediaryService.presentToastError("Error al guardar, intente más tarde");
              this.intermediaryService.dismissLoading();
            });
          }
        }
      ]
    });

    await prompt.present();

  }

  clear() {
    this.listaFechas = [];
    this.selectTem = false;
    this.intermediaryService.presentLoading();
    this.warehousesOriginList.sort((unaCadena, otraCadena) => unaCadena.id - otraCadena.id);

    this.warehousesDestinationList.forEach(val => {
      val.destinos = [],
        val.destinos_label = ''
    });

    var tempDestination = [];
    this.warehousesOriginList.forEach(origin => {
      this.warehousesDestinationList.forEach(destination => {
        if (destination.id === origin.id) {
          tempDestination.push(destination);
        }
      });
      origin.is_main = false;
    });

    this.warehousesDestinationList = [];
    this.warehousesDestinationList = tempDestination;

    this.selectDates = [{
      date: 'todas las fechas seleccionadas',
      warehouses: [],
      value: null
    }];

    /** limpiar check */
    this.listOriginCheck = [];
    this.selectForm.get("isChecked").setValue(false);

    this.manageSelectedRadio();
    this.manageSelectedClass();
    this.getCalendarDates();
    this.dates = [];
    this.cantDates = false;
    this.intermediaryService.dismissLoading();
  }

  addWarehouses(): any[] {
    var warehouses: any = [];

    this.warehousesDestinationList.forEach(val => {
      if (val.destinos.length > 0) {
        warehouses.push({
          originWarehouseId: val.id,
          destinationWarehouseIds: (val.destinos.map(warehouse => warehouse.id))
        });
      }
    });

    return warehouses;
  }


  /**
   * Store new ????
   */
  storeDate(): void {
    let globalValues = {
      calendars: []
    }
    this.selectDates.forEach((date, i) => {
      if (i == 0)
        return false;
      var value = {
        date: '',
        warehouses: []
      };

      if (this.date.date != 'todas las fechas seleccionadas')
        value.warehouses = this.addWarehouses();
      else
        value.warehouses = this.addWarehouses();
      value.date = date.date;
      if (value.warehouses.length)
        globalValues.calendars.push(value)
    });

    this.intermediaryService.presentLoading();
    this.calendarService.store(globalValues).subscribe(() => {
      this.clear()
      this.intermediaryService.presentToastSuccess("Guardado con éxito");
      this.intermediaryService.dismissLoading();
      this.getCalendarDates();
    }, (error) => {
      this.intermediaryService.presentToastError("Error al guardar, intente más tarde");
      this.intermediaryService.dismissLoading();
    });
    // console.log(globalValues);
  }

  manageSelectedClass(): void {
    let days: Array<any> = <any>document.getElementsByClassName("dp-calendar-day");
    let days1: Array<any> = <any>document.getElementsByClassName("tselected2");

    for (let i = 0; i < days.length; i++) {
      let day = days[i];
      this.selectDates.forEach(date => {

        if (date.date.split("-").reverse().join("-") == day.dataset.date) {
          if ((date.warehouses.length) || (date.date && this.addWarehouses().length)) {
            day.className += ' tselected';
            day.className = day.className.replace(/tselected2/g, "");
          } else {
            // console.log("borrando")
            day.className = day.className.replace(/tselected/g, "");
          }
        }
      });
    }

    for (let i = 0; i < days1.length; i++) {
      let day1 = days1[i];
      day1.className = day1.className.replace(/haveDate/g, "");
      day1.className = day1.className.replace(/tselected2/g, "");
      this.selectDates.forEach(date => {

        if (date.date.split("-").reverse().join("-") == day1.dataset.date) {
          if ((date.warehouses.length) || (date.date && this.addWarehouses().length)) {
            day1.className += ' tselected';
          }
        }
      });
    }
  }


  addDarkBlueOrRed() {
    let days: Array<any> = <any>document.getElementsByClassName("dp-calendar-day");

    for (let i = 0; i < days.length; i++) {
      let day = days[i];


      this.selectDates.forEach(date => {
        if (date.date.split("-").reverse().join("-") == day.dataset.date) {
          day.className = day.className.replace(/haveDate/g, "");
          day.className = day.className.replace(/tselected2/g, "");
          day.className = day.className.replace(/tselected/g, "");
          if ((date.warehouses.length) || (date.date && this.addWarehouses().length)) {
            if (!this.selectTem) {
              day.className += ' tselected2';
            } else {
              day.className += ' tselected';
            }

          } else {
            day.className += ' haveDate';
          }
        }
      });
    }
  }


  addGreen() {
    let days: Array<any> = <any>document.getElementsByClassName("dp-calendar-day");

    for (let i = 0; i < days.length; i++) {
      let day = days[i];


      this.selectDates.forEach(date => {
        if (date.date.split("-").reverse().join("-") == day.dataset.date) {
          day.className = day.className.replace(/haveDate/g, "");
          day.className = day.className.replace(/tselected2/g, "");
          day.className = day.className.replace(/tselected/g, "");
          if ((date.warehouses.length) || (date.date && this.addWarehouses().length)) {

            day.className += ' tselected';
          } else {
            day.className += ' haveDate';
          }
        }
      });
    }
  }

  /**
   * @author "Gaetano Sabino"
   * @description "Seleciona las fechas presentes en la BD con la fechas selecionadas"
   */
  private deleteDates(dates:string[]){
    let data:string;
    const listaDatesdb:string[]=[];
    dates.forEach(ele =>{
      data = this.listaFescasDb$.find(date => date === ele );
      if(data){
        listaDatesdb.push(data);
      }
    })
    this.listaFechas = listaDatesdb
  }

  /**
   * @author Gaetano Sabino
   * @description Retorna las fechas que solo estan presente en la BD
   */
  get ListaFechas$(){
    return this.listaFechas;
  }

  /**
   * @description Envia las fechas que ya existen en la Bd
   * @method delete
   * @author "Gaetano Sabino"
   */
  deleteAllFechasSelect(){

    this.calendarService.postDateDelete(this.ListaFechas$).subscribe(data=>{
      if(data.length > 0){
        this.clear();
        this.intermediaryService.presentToastSuccess("Fechas eliminada con éxito");
        this.intermediaryService.dismissLoading();
        this.getCalendarDates();
        this.getTemplates();
        return;
      }
      if(data.length === 0){
        this.intermediaryService.presentToastError("Ninguna fecha incontrada");
        this.intermediaryService.dismissLoading();
        return;
      }


    },error=>{
      this.intermediaryService.presentToastError("Error en eliminar las Fechas");
      this.intermediaryService.dismissLoading();
    });
  }





  manageSelectedClass2(): void {

    let days = <any>document.getElementsByClassName("dp-calendar-day");
    for (let i = 0; i < days.length; i++) {
      let day = days[i];
      this.selectDates.forEach(date => {
        if (date.date.split("-").reverse().join("-") == day.dataset.date) {
          if ((date.warehouses.length) || (date.date && this.addWarehouses().length)) {
            day.className += ' tselected2';
          } else {
            // console.log("borrando")
            day.className = day.className.replace(/tselected2/g, "");
          }
        }
      });
    }
  }

  manageSelectedRadio(): void {

    let days = <any>document.getElementsByClassName("dp-selected");
    for (let i = 0; i < days.length; i++) {
      let day = days[i];
      day.className = day.className.replace(/dp-selected/g, "");
    }
  }

  /**
   * Tells if all dates have selected warehouses
   * @returns status of submit
   */
  validToStore() {
    let flag = true;
    if (this.date) {
      if (this.date.date == 'todas las fechas seleccionadas' && this.addWarehouses().length)
        return true;
      this.selectDates.forEach((date, i) => {
        if (!i)
          return true;
        if (!(date.warehouses.length || (date.value && this.addWarehouses().length)))
          flag = false;
      });
    } else
      flag = false;


    return flag;
  }

  /**
   * Eliminar la plantila
   * @param idTemplate de la plantilla a eliminar
   */

  async deleteTemplate(idTemplate) {
    const prompt = await this.alertController.create({
      message: '¿Seguro desea eliminar la plantilla?',
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
            this.calendarService.deleteTemplate(idTemplate).subscribe(template => {
              this.intermediaryService.presentToastSuccess("Plantilla eliminada con éxito");
              this.intermediaryService.dismissLoading();
              this.templates = [];
              this.clear();
              this.getTemplates();
            }, () => {
              this.intermediaryService.presentToastError("Error al eliminar, intente más tarde");
              this.intermediaryService.dismissLoading();
            });
          }
        }
      ]
    });

    await prompt.present();

  }

  changeValues(): void {
    /**Listen for changes on isChecked control */
    this.selectForm.get("isChecked").valueChanges.subscribe((isChecked) => {
      this.warehousesOriginList.forEach(origin => {
        if (isChecked) {
          var obj = {
            id: origin.id
          };
          this.listOriginCheck.push(obj);
        }
      });

      if (!isChecked) {
        (<FormArray>this.selectForm.get("origins")).controls.forEach(control => {
          control.setValue(false, { emitEvent: false });
        });
        this.listOriginCheck = [];
      } else {
        (<FormArray>this.selectForm.get("origins")).controls.forEach(control => {
          control.setValue(true, { emitEvent: true });
        });
      }
    });

  }


  /**
   * Seleccionar origenes
   */
  addValueArray(origin: any): void {

    var indexA = -1;

    this.listOriginCheck.forEach((val, index) => {
      if (val.id === origin.id) {
        indexA = index;
      }
    });


    if (indexA > -1)
      this.listOriginCheck.splice(indexA, 1);
    else {
      var obj = {
        id: origin.id
      };
      this.listOriginCheck.push(obj);
    }
  }

  /**
   * Abrir modal para agregar destinos
   */
  async openModalDestination() {
    this.listOriginCheck = [];

    this.cantChecks().forEach(select => {
      this.listOriginCheck.push({
        id: select
      })
    });

    var destinations = [];
    var destinos = [];
    this.warehousesOriginDestinationList.forEach(destination => {
      this.listOriginCheck.forEach(originCheck => {
        if (destination.idOrigen === originCheck.id) {
          destinations = destinations.concat(destination.destinations);
        }
      });
    });

    this.warehousesDestinationList.forEach(val => {
      this.listOriginCheck.forEach(originCheck => {
        if (val.id === originCheck.id) {
          destinos = destinos.concat(val.destinos);
        }
      });
    });

    /** Eliminar repetidos */
    destinations = destinations.filter((valorActual, indiceActual, arreglo) => {
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.destinationWarehouse.id) === JSON.stringify(valorActual.destinationWarehouse.id)) === indiceActual
    });

    destinos = destinos.filter((valorActual, indiceActual, arreglo) => {
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.id) === JSON.stringify(valorActual.id)) === indiceActual
    });

    /** ordenar destinos */
    destinations.sort((destinoUno, destinoOtro) => destinoUno.destinationWarehouse.id - destinoOtro.destinationWarehouse.id);

    let modal = (await this.modalController.create({
      component: StoreComponent,
      componentProps: {
        originDestinations: destinations,
        destinos: destinos
      }
    }));
    modal.onDidDismiss().then((data) => {
      this.intermediaryService.presentLoading();
      var dataInfo: any = data;
      if (dataInfo.data !== undefined) {
        this.warehousesDestinationList.forEach(val => {
          val.destinos = new Array;
          val.destinos_label = '';
        });
        dataInfo.data.listDestinos.forEach(destino => {
          this.warehousesDestinationList.forEach(val2 => {
            this.listOriginCheck.forEach(originCheck => {
              if (val2.id === originCheck.id && originCheck.id !== destino.id) {
                val2.destinos.push({
                  id: destino.id,
                  name: destino.name
                });
                if (val2.destinos_label != '')
                  val2.destinos_label += ', ' + destino.name;
                else
                  val2.destinos_label = destino.name
              }
            });
          });
        });

        this.selectDates.forEach((date, i) => {
          if (i == 0)
            return false;
          date.warehouses = this.addWarehouses();
        });

        this.sortByDestinations();
      }
      this.intermediaryService.dismissLoading();
    })
    modal.present();
  }

  cantChecks() {
    const selectedOrderIds = this.selectForm.value.origins
      .map((v, i) => v ? this.warehousesOriginList[i].id : null)
      .filter(v => v !== null);

    return selectedOrderIds;
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.datePicker.api.open();
    // console.log(this.datePicker);
  }


}
