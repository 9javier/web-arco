import { Component, OnInit,ViewChild, Sanitizer, ViewChildren, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DatePickerComponent,IDatePickerConfig } from 'ng2-date-picker';
import { WarehouseService } from 'libs/services/src/lib/endpoint/warehouse/warehouse.service';
import { FormBuilder, FormGroup, FormArray, Form } from '@angular/forms';
import { WarehouseModel,CalendarModel,CalendarService, IntermediaryService } from '@suite/services';
import { AlertController, IonSelect } from '@ionic/angular';

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
    drops:'down'
  } 
  currentTemplate;
  initialValue = null;
  templateBase:Array<CalendarModel.TemplateWarehouse> = [];
  dates;
  date:{date:string;warehouses:Array<CalendarModel.TemplateWarehouse>;value:any};
  selectDates:Array<{date:string;warehouses:Array<CalendarModel.TemplateWarehouse>;value:any}> = [{
    date:'all',
    warehouses:[],
    value:null
  }];

  template:FormGroup = this.formBuilder.group({
    template:''
  });

  form:FormGroup = this.formBuilder.group({
    warehouses: new FormArray([])
  });

  warehouses:Array<WarehouseModel.Warehouse> = [];
  templates:Array<CalendarModel.Template> = [];

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
        date:'all',
        warehouses:[],
        value:null
      }];
      selectDates.forEach(date=>{
        this.loadingDates = true;
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
      })
      this.selectDates = auxDates;
      this.changeDetectorRef.detectChanges();
      this.intermediaryService.presentLoading();
      this.calendarService.getTemplatesByDate(selectDates).subscribe(templates=>{
        setTimeout(()=>{this.loadingDates = false},10);
        this.intermediaryService.dismissLoading();
        /**recorro todos los templates */
        templates.forEach(template=>{
          this.selectDates.forEach(date=>{
            if(template.date == date.date){
              date.warehouses = template.warehouses;
            }
          });
        });
        this.manageSelectedClass();
      },()=>{
        setTimeout(()=>{this.loadingDates = false},10);
        this.intermediaryService.dismissLoading();
      })
      console.log(this.selectDates);
    })
  }

  /**
   * Get the base template skeleton to show
   */
  getBase():void{
    this.intermediaryService.presentLoading();
    this.calendarService.getBaseBad().subscribe(warehouses=>{
      console.log(warehouses);
      this.intermediaryService.dismissLoading();
      this.templateBase = warehouses;
      this.initTemplateBase(warehouses);
    },()=>{
      this.intermediaryService.dismissLoading();
    })
  }

  manageSelectedClass():void{
    let days = <any>document.getElementsByClassName("dp-calendar-day");
    for(let i=0;i<days.length;i++){
      let day = days[i];
      this.selectDates.forEach(date=>{
        if(date.date.split("-").reverse().join("-") == day.dataset.date){
          console.log(date.warehouses.length, date.value?this.formatValue(date.value).warehouses.length:0);
          if((date.warehouses.length) || (date.value && this.formatValue(date.value).warehouses.length)){
            day.className+= ' tselected'; 
          }else{
            console.log("borrando")
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
        if(date.split("-").reverse().join("-") == day.dataset.date){
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
            if(date.date == this.date.date){
              
              date.value = JSON.parse(JSON.stringify(this.form.value));
              console.log(this.formatValue(date.value).warehouses.length);
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
        destinationWarehouseIds:(value.destinationsWarehouses.map(warehouse=>warehouse.selected?warehouse.id:false)).filter(value=>value)
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
      if(i==0)
        return false;
      let value;
      if(this.date.date != 'all')
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
    console.log(globalValues);
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
            console.log('Confirm Cancel');
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
        console.log(response);
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
    if(this.date.date == 'all' && this.formatValue(this.form.value).warehouses.length )
      return true;
    this.selectDates.forEach(value=>{
      if(!(value.warehouses.length || (value.value && this.formatValue(value.value).warehouses.length)))
        flag = false;
    });
    return flag;
  }

  /**
   * Charge template for render in page
   * @param template - the template selected
   */
  selectTemplate(template:CalendarModel.Template,value=null,date=null){
    this.date = date; 
    if(value){
      this.form.patchValue(value,{emitEvent:false});
      return false;
    }
    let warehouses = template.warehouses;
    this.initTemplateBase(this.templateBase);
    (<FormArray>this.form.get("warehouses")).controls.forEach(warehouseControl=>{
      warehouses.forEach(templateWarehouse=>{
        if(templateWarehouse.originWarehouse.id == warehouseControl.get("originWarehouse").value.id){
          templateWarehouse.destinationsWarehouses.forEach(templateDestination=>{
            (<FormArray>warehouseControl.get("destinationsWarehouses")).controls.forEach(destinationControl=>{
              if(destinationControl.get("id").value == templateDestination.destinationWarehouse.id)
                destinationControl.get("selected").setValue(true);
            })
          })
        }
      })
    });
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
      warehouses: new FormArray([])
    });
    warehouses.forEach(warehouse=>{
      (<FormArray>this.form.get("warehouses")).push(
        this.formBuilder.group({
          opened:false,
          originWarehouse:this.formBuilder.group({
            id:warehouse.originWarehouse.id,
            name:warehouse.originWarehouse.name
          }),
          destinationsWarehouses:(this.formBuilder.array(
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
          ))     
        })
      )
    });
    this.getTemplates();
    this.initialValue = this.form.value;
  }

  clearCalendar(){
    this.selectDates = [{
      date:'all',
      warehouses:[],
      value:null
    }];
    this.dates = [];  
    this.getCalendarDates()
  }
  clear(){
    this.template.get("template").patchValue('',{emitEvent:false});
    this.selectDates = [{
      date:'all',
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
      warehouses: new FormArray([])
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
            ))     
          })
        )
      });
      this.getTemplates();
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.datePicker.api.open();
    console.log(this.datePicker);
  }

}
