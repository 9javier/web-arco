import { Component, OnInit,ViewChild, Sanitizer, ViewChildren, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DatePickerComponent,IDatePickerConfig } from 'ng2-date-picker';
import { WarehouseService } from 'libs/services/src/lib/endpoint/warehouse/warehouse.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Form } from '@angular/forms';
import { WarehouseModel,CalendarModel,CalendarService, IntermediaryService } from '@suite/services';
import { AlertController, IonSelect } from '@ionic/angular';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import * as _ from 'lodash';

@Component({
  selector: 'suite-calendar-picking',
  templateUrl: './calendar-picking.component.html',
  styleUrls: ['./calendar-picking.component.scss']
})
export class CalendarPickingComponent implements OnInit {

  @ViewChild("templates") templatesSelect:IonSelect;

  calendarConfiguration:IDatePickerConfig  = {
    closeOnSelect:false,
    allowMultiSelect:true,
    hideOnOutsideClick:false,
    appendTo:'.append',
    drops:'down',
    firstDayOfWeek: 'mo'
  } 
  currentTemplate;
  initialValue = null;
  templateBase:Array<CalendarModel.TemplateWarehouse> = [];
  dates;
  date:{date:string;warehouses:Array<CalendarModel.TemplateWarehouse>;value:any};
  selectDates:Array<{date:string;warehouses:Array<CalendarModel.TemplateWarehouse>;value:any}> = [{
    date:'todas las fechas seleccionadas',
    warehouses:[],
    value:null
  }];

  openeds:Array<boolean> = [];

  modelDate;

  template:FormGroup = this.formBuilder.group({
    template:''
  });

  form:FormGroup = this.formBuilder.group({
    warehouses: new FormArray([]),
    warehousesInput: [],
    warehousesList: []
  });

  warehouses:Array<WarehouseModel.Warehouse> = [];
  warehousesList:Array<WarehouseModel.Warehouse> = [];
  templates:Array<CalendarModel.Template> = [];
  updateTemplate: CalendarModel.Template;
  warehousesInput:Array<WarehouseModel.Warehouse> = [];

  @ViewChild(DatePickerComponent) datePicker:DatePickerComponent;

  constructor(
    private warehouseService:WarehouseService,
    private calendarService:CalendarService,
    private formBuilder:FormBuilder,
    private intermediaryService:IntermediaryService,
    private alertController:AlertController,
    private sanitizer:Sanitizer,
    private changeDetectorRef:ChangeDetectorRef
  ) { }
  loadingDates:boolean = false;

  compareDate(obj1,obj2){
    return obj1.date === obj2.date;
  }

  ngOnInit() {
    this.getBase();
    this.getCalendarDates();

    this.datePicker.onLeftNav.subscribe(changes=>{
      this.getCalendarDates();
    });

    this.datePicker.onRightNav.subscribe(changes=>{
      this.getCalendarDates();
    });

    this.datePicker.onGoToCurrent.subscribe(changes=>{
      this.getCalendarDates();
    })
  


    this.datePicker.onSelect.subscribe((changes)=>{
      let selectDates = this.dates.map(_=>{
        return _.format("YYYY-MM-DD");
      });
      let auxDates = [{
        date:'todas las fechas seleccionadas',
        warehouses:[],
        value:null
      }];
      selectDates.forEach(date=>{
        this.loadingDates = true;
        let aux = this.selectDates.find(_date=> _date.date === date);
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
      })
      this.selectDates = auxDates;
      this.changeDetectorRef.detectChanges();
      this.intermediaryService.presentLoading();
      this.calendarService.getTemplatesByDate(selectDates).subscribe(templates=>{
        setTimeout(()=>{this.loadingDates = false},10);
        this.intermediaryService.dismissLoading();
        templates.forEach(template=>{
          this.selectDates.forEach(date=>{
            if(template.date === date.date){
              date.warehouses = template.warehouses;
            }
          });
        });
        let equals = true;
        for(let i = 1; i < this.selectDates.length; i++) {
          for(let j = 0; j < this.selectDates[i].warehouses.length; j++) {
            if(i+1 <= this.selectDates.length && this.selectDates[i+1]) {
              if(this.selectDates[i].warehouses.length === this.selectDates[i+1].warehouses.length){
                if(_.isEqual(this.selectDates[i].warehouses[j].originWarehouse, this.selectDates[i+1].warehouses[j].originWarehouse)) {
                  let currentWarehouses = this.selectDates[i].warehouses[j].destinationsWarehouses;
                  let nextWarehouses = this.selectDates[i+1].warehouses[j].destinationsWarehouses;
                  if(currentWarehouses.length === nextWarehouses.length) {
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
        
        if(equals && this.selectDates.length !== 1) {

          this.setWarehousesOfDate(this.selectDates[1].warehouses, true);

        } else if(this.selectDates.length !== 1){
          this.setWarehousesOfDate(this.selectDates[1].warehouses, false);
        }
        else{
          this.resetAcordeons();
        }
        this.modelDate = auxDates[0];
        this.date = this.modelDate;
        this.manageSelectedClass();
      },()=>{
        setTimeout(()=>{this.loadingDates = false},10);
        this.intermediaryService.dismissLoading();
      })
    })
  
  }

  /**
   * Set warehouses by date
   */

  setWarehousesOfDate(selectDateWarehouses, valueDate: boolean) {
    (<FormArray>this.form.get("warehouses")).controls.forEach(warehouseControl=>{
      selectDateWarehouses.forEach(templateWarehouse=>{
        if(templateWarehouse.originWarehouse.id === warehouseControl.get("originWarehouse").value.id){
          templateWarehouse.destinationsWarehouses.forEach(templateDestination=>{
            (<FormArray>warehouseControl.get("destinationsWarehouses")).controls.forEach(destinationControl=>{
              if(destinationControl.get("id").value === templateDestination.destinationWarehouse.id){
                if(valueDate) {
                  destinationControl.get("selected").setValue(true);
                  warehouseControl.get("openModal").setValue(true);
                } else {
                  destinationControl.get("selected").setValue(false);
                  warehouseControl.get("openModal").setValue(false);
                }
              }
            })
          })
        }
      })
    });

    this.orderAcordeons();
  }

  /**
   * Get the base template skeleton to show
   */
  getBase():void{
    this.intermediaryService.presentLoading();
    this.calendarService.getBaseBad().subscribe(warehouses=>{
      this.intermediaryService.dismissLoading();
      this.templateBase = warehouses;
      warehouses[0].destinationsWarehouses.forEach(destination => {
        this.warehousesList.push(destination.destinationWarehouse);
      })
      this.initTemplateBase(warehouses);
    },()=>{
      this.intermediaryService.dismissLoading();
    })
  }

  clearData(){
    this.form.patchValue(this.initialValue,{emitEvent:false});
    this.resetAcordeons();
    this.selectDates.forEach(date=>{
      if(this.date.date === date.date || this.date.date === 'todas las fechas seleccionadas')
        date.value = this.initialValue;
      this.manageSelectedClass();
    })
  }

  manageSelectedClass():void{
    let days = <any>document.getElementsByClassName("dp-calendar-day");
    for(let i=0;i<days.length;i++){
      let day = days[i];
      this.selectDates.forEach(date=>{
        if(date.date.split("-").reverse().join("-") === day.dataset.date){
          if((date.warehouses.length) || (date.value && this.formatValue(date.value).warehouses.length)){
            day.className+= ' tselected'; 
          }else{
            day.className = day.className.replace(/tselected/g, "");
            
          }
            
        }
      });
    }
  }

  manageHaveClass(dates:Array<string>):void{
    let days = <any>document.getElementsByClassName("dp-calendar-day");
    for(let i=0;i<days.length;i++){
      let day = days[i];
      dates.forEach(date=>{
        if(date.split("-").reverse().join("-") === day.dataset.date){
          day.className+= ' haveDate'; 
        }
      });
    }
  }

  /**
   * Start listener for an specific group
   * @param group - group to atach listener
   */
  startListener(group:FormGroup){
    group.get("selected").valueChanges.subscribe(change=>{
      //if(this.formatValue(this.form.value).warehouses.length)
      setTimeout(()=>{
        if(this.date){
          this.selectDates.forEach(date=>{
            if(date.date === this.date.date || this.date.date === 'todas las fechas seleccionadas'){
              date.value = JSON.parse(JSON.stringify(this.form.value));
            }
          })
        }
        this.manageSelectedClass();
      },300);
      (<FormArray>group.parent).controls.forEach(control=>{
        control.get("radio").setValue(false,{emitEvent:false});
      });
    });
    group.get("radio").valueChanges.subscribe(change=>{
      if(change){
        (<FormArray>group.parent).controls.forEach(control=>{
          control.get("selected").setValue(false,{emitEvent:false});
          control.get("radio").setValue(false,{emitEvent:false});
        });
        group.get("selected").setValue(true,{emitEvent:false});
        group.get("radio").setValue(true,{emitEvent:false});
      }
    });
  }
  /**
   * Format the form value to the needed by the server
   */
  formatValue(rawValue:any,store=false):CalendarModel.SingleTemplateParams{
    let value:CalendarModel.SingleTemplateParams = JSON.parse(JSON.stringify(rawValue));
    value.warehouses = (<Array<any>>rawValue.warehouses.map(value=>{
      return ({
        originWarehouseId:value.originWarehouse.id,
        destinationWarehouseIds:(value.destinationsWarehouses.map(warehouse=>warehouse.selected?warehouse.id:false)).filter(value=>value),
        openModal: false
      })
    })).filter(object=>(object.destinationWarehouseIds.length > 0));
    return value;
  }

  /**
   * Store new ????
   */
  store():void{
    let globalValues = {
      calendars:[]
    }
    this.selectDates.forEach((date,i)=>{
      if(i===0)
        return false;
      let value;
      if(this.date.date !== 'todas las fechas seleccionadas')
        value = this.formatValue((date.value));
      else
        value = this.formatValue(this.form.value);
      value["date"] =date.date;
      if(value.warehouses.length)
        globalValues.calendars.push(value)
    })
    
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
  }

  /**
   * Store a new template
   * @param template - the template to save
   */
  async storeTemplate(template:CalendarModel.SingleTemplateParams){


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
 

  /**
   * Obtain all warehouses for use in select
   */
  getWarehouses():void{
    this.warehouseService.getIndex().then(observable=>{
      observable.subscribe(response=>{
      })
    })
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
   * Tells if all dates have selected warehouses
   * @returns status of submit
   */
  validToStore(){
    let flag = true;
    if(this.date.date === 'todas las fechas seleccionadas' && this.formatValue(this.form.value).warehouses.length )
      return true;
    this.selectDates.forEach((date,i)=>{
      if(!i)
        return true;
      if(!(date.warehouses.length || (date.value && this.formatValue(date.value).warehouses.length)))
        flag = false;
    });
    return flag;
  }

  /**
   * Charge template for render in page
   * @param template - the template selected
   */
  selectTemplate(template:CalendarModel.Template,value=null){
    let warehouses = template.warehouses;
    this.updateTemplate = template;
    (<FormArray>this.form.get("warehouses")).controls.forEach(warehouseControl=>{
      (<FormArray>warehouseControl.get("destinationsWarehouses")).controls.forEach(destinationControl=>{
        destinationControl.get("selected").setValue(false);
        warehouseControl.get("openModal").setValue(false);
      })
    });

    (<FormArray>this.form.get("warehouses")).controls.forEach(warehouseControl=>{
      warehouses.forEach(templateWarehouse=>{
        if(templateWarehouse.originWarehouse.id === warehouseControl.get("originWarehouse").value.id){
          templateWarehouse.destinationsWarehouses.forEach(templateDestination=>{
            (<FormArray>warehouseControl.get("destinationsWarehouses")).controls.forEach(destinationControl=>{
              if(destinationControl.get("id").value === templateDestination.destinationWarehouse.id){
                destinationControl.get("selected").setValue(true);
                warehouseControl.get("openModal").setValue(true);
              }
            })
          })
        }
      })
    });

    this.orderAcordeons();
  }

  /**
   * Render a list of templates
   * @param warehouses - list of warehouses to render
   */
  initTemplateBase(warehouses:Array<CalendarModel.TemplateWarehouse>){
    if(this.initialValue){
      this.form.patchValue(this.initialValue,{emitEvent:false});
      return false;
    }
    this.form = this.formBuilder.group({
      warehouses: new FormArray([]),
      warehousesInput: [],
      warehousesList: this.warehousesList
    });
    this.openeds = [];
    warehouses.forEach(warehouse=>{
      this.openeds.push(false);
      (<FormArray>this.form.get("warehouses")).push(
        this.formBuilder.group({
          originWarehouse:this.formBuilder.group({
            id:warehouse.originWarehouse.id,
            name:warehouse.originWarehouse.name
          }),
          destinationsWarehouses:(this.formBuilder.array(
            warehouse.destinationsWarehouses.map(warehouse => {
              this.warehouses.push(warehouse.destinationWarehouse);
              let group = (this.formBuilder.group({
                id:warehouse.destinationWarehouse.id,
                name:warehouse.destinationWarehouse.name,
                selected:false,
                radio:false,
              }));
              this.startListener(group)
              return group;
            })
          )),
          openModal: false    
        })
      )
    });
    this.getTemplates();
    this.initialValue = this.form.value;
  }

  clearCalendar(){
    this.selectDates = [{
      date:'todas las fechas seleccionadas',
      warehouses:[],
      value:null
    }];
    this.dates = [];  
    this.getCalendarDates()
  }
  clear(){
    this.template.get("template").patchValue('',{emitEvent:false});
    this.selectDates = [{
      date:'todas las fechas seleccionadas',
      warehouses:[],
      value:null
    }];
    this.dates = [];
    this.initTemplateBase(this.templateBase);
    this.getCalendarDates();
  }

  getCalendarDates():void{
    this.calendarService.getCalendarDates().subscribe(dates=>{
      this.manageHaveClass(dates);
    });
  }

  /**
   * Obtain the template base and init form
   */
  initForm():void{
    this.form = this.formBuilder.group({
      warehouses: new FormArray([]),
      warehousesInput: [],
      warehousesList: this.warehousesList
    });
    this.calendarService.getBase().subscribe(base=>{
      base.warehouses.forEach(warehouse=>{
        (<FormArray>this.form.get("warehouses")).push(
          this.formBuilder.group({
            originWarehouse:this.formBuilder.group({
              id:warehouse.originWarehouse.id,
              name:warehouse.originWarehouse.name
            }),
            warehousesDestinations:(this.formBuilder.array(
              warehouse.destinationsWarehouses.map(warehouse=>{
                let group = (this.formBuilder.group({
                  id:warehouse.destinationWarehouse.id,
                  name:warehouse.destinationWarehouse.name,
                  selected:false,
                  radio:false,
                }));
                this.startListener(group)
                return group;
              })
            )),
            openModal: false    
          })
        )
      });
      this.getTemplates();
    });
  }

  /**
   * Add warehouse to an acordeon
   * @param warehouseId 
   */
  addWarehouse(warehouseId: number) {
    let value = this.form.get("warehousesInput").value;
    if(value) {
      (<FormArray>this.form.get("warehouses")).controls.forEach(warehouseControl=>{
        (<FormArray>warehouseControl.get("destinationsWarehouses")).controls.forEach(destinationControl=>{
          if(destinationControl.get("id").value === value.slice(-1).pop() && warehouseControl.get("originWarehouse").value.id === warehouseId){
            destinationControl.get("selected").setValue(true);
            this.form.get("warehousesInput").setValue([]);
            warehouseControl.get("openModal").setValue(true);
          }
        });
      });
    }
    this.form.get("warehousesInput").setValue([]);
  }

  /**
   * Remove warehouse to an acordeon
   * @param warehouseId 
   */
  
  deletedWarehouseOfTemplate(id: number, warehouseId: number) {
    (<FormArray>this.form.get("warehouses")).controls.forEach(warehouseControl=>{
      (<FormArray>warehouseControl.get("destinationsWarehouses")).controls.forEach(destinationControl=>{
        if(destinationControl.get("id").value === id && destinationControl.get("selected").value
        && warehouseControl.get("originWarehouse").value.id === warehouseId){          
          destinationControl.get("selected").setValue(false);
        }
      });
    });
  }

  /**
   * Reset all acordeons to a original state
   */
  resetAcordeons() {
    (<FormArray>this.form.get("warehouses")).controls.forEach(warehouseControl=>{
        warehouseControl.get("openModal").setValue(false);
    });
  }

  /**
   * Order acordeons if have warehouses
   */
  orderAcordeons() {
    (<FormArray>this.form.get("warehouses")).controls.sort((current, next) => {
      return next.get("openModal").value - current.get("openModal").value
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.datePicker.api.open();
  }

}
