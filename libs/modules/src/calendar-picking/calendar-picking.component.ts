import { Component, OnInit,ViewChild } from '@angular/core';
import { DatePickerComponent,IDatePickerConfig } from 'ng2-date-picker';
import { WarehouseService } from 'libs/services/src/lib/endpoint/warehouse/warehouse.service';
import { FormBuilder, FormGroup, FormArray, Form } from '@angular/forms';
import { WarehouseModel,CalendarModel,CalendarService, IntermediaryService } from '@suite/services';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'suite-calendar-picking',
  templateUrl: './calendar-picking.component.html',
  styleUrls: ['./calendar-picking.component.scss']
})
export class CalendarPickingComponent implements OnInit {

  calendarConfiguration:IDatePickerConfig  = {
    closeOnSelect:false,
    allowMultiSelect:true,
    hideOnOutsideClick:false,
    appendTo:'.append',
    drops:'down'
  } 
  initialValue = null;
  templateBase:Array<CalendarModel.TemplateWarehouse> = [];
  dates;
  date:string;
  selectDates:Array<{date:string;warehouses:Array<CalendarModel.TemplateWarehouse>;value:any}> = [];

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
    private alertController:AlertController
  ) { }

  ngOnInit() {
    //this.getWarehouses();
    //this.initForm();
    this.getBase();
    this.datePicker.onSelect.subscribe(changes=>{
      let selectDates = this.dates.map(_=>{
        return _.format("YYYY-MM-DD");
      });
      selectDates.forEach(date=>{
        let aux = this.selectDates.find(_date=>{return (_date.date == date)});
        if(!aux){
          this.selectDates.push(
            {
              date:date,
              warehouses:[],
              value:null
            }
          );
        }
      })
      this.intermediaryService.presentLoading();
      this.calendarService.getTemplatesByDate(selectDates).subscribe(templates=>{
        this.intermediaryService.dismissLoading();
        /**recorro todos los templates */
        templates.forEach(template=>{
          this.selectDates.forEach(date=>{
            if(template.date == date.date){
              date.warehouses = template.warehouses;
            }
          });
        });
      },()=>{
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

  /**
   * Start listener for an specific group
   * @param group - group to atach listener
   */
  startListener(group:FormGroup){
    group.get("selected").valueChanges.subscribe(change=>{
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
    if(this.date){
      this.selectDates.forEach(date=>{
        if(date.date == this.date){
          date.value = this.form.value;
        }
         
      })
    }
    let globalValues = {
      calendars:[]
    }
    this.selectDates.forEach(date=>{
      let value = this.formatValue(date.value);
      value["date"] =date.date;
      if(value.warehouses.length)
        globalValues.calendars.push(value)
    })
    
    this.intermediaryService.presentLoading();
    this.calendarService.store(globalValues).subscribe(()=>{
      this.initTemplateBase(this.templateBase);
      this.intermediaryService.presentToastSuccess("Guardado con éxito");
      this.intermediaryService.dismissLoading();
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
              this.initTemplateBase(this.templateBase);
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
   * Charge template for render in page
   * @param template - the template selected
   */
  selectTemplate(template:CalendarModel.Template,value){

    if(this.date){
      this.selectDates.forEach(date=>{
        if(date.date == this.date){
          date.value = this.form.value;
        }
         
      })
    }
    if(value){
      this.form.patchValue(value,{emitEvent:false});
      return false;
    }
      
    let warehouses = template.warehouses;
    console.log("estos son",warehouses);
    this.initTemplateBase(this.templateBase);
    this.date = template.date;
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
  }

}
