import { Component, OnInit,ViewChild } from '@angular/core';
import { DatePickerComponent,IDatePickerConfig } from 'ng2-date-picker';
import { WarehouseService } from 'libs/services/src/lib/endpoint/warehouse/warehouse.service';
import { FormBuilder, FormGroup, FormArray, Form } from '@angular/forms';
import { WarehouseModel,CalendarModel,CalendarService, IntermediaryService } from '@suite/services';

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

  dates;

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
    private intermediaryService:IntermediaryService
  ) { }

  ngOnInit() {
    this.getWarehouses();
    this.initForm();
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
      alert("test")
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
        destinationWarehouseIds:(value.warehousesDestinations.map(warehouse=>warehouse.selected?warehouse.id:false)).filter(value=>value)
      })
    })).filter(object=>(object.destinationWarehouseIds.length > 0));
    console.log(value);
    return value;
  }

  /**
   * Store new ????
   */
  store(value:CalendarModel.SingleTemplateParams):void{
    value.dates = this.dates.map(date=>date.format("YYYY-MM-DD"));
    this.intermediaryService.presentLoading();
    this.calendarService.store(value).subscribe(()=>{
      this.initForm();
      this.intermediaryService.presentToastSuccess("Guardado con éxito");
      this.intermediaryService.dismissLoading();
    },(error)=>{
      this.intermediaryService.presentToastError("Error al guardar, intente más tarde");
      this.intermediaryService.dismissLoading();
    });
    console.log(value);
  }

  /**
   * Store a new template
   * @param template - the template to save
   */
  storeTemplate(template:CalendarModel.SingleTemplateParams):void{
    this.intermediaryService.presentLoading();
    this.calendarService.storeTemplate(template).subscribe(()=>{
      this.initForm();
      this.intermediaryService.presentToastSuccess("Plantilla guardada con éxito");
      this.intermediaryService.dismissLoading();
    },()=>{
      this.intermediaryService.presentToastError("Error al guardar, intente más tarde");
      this.intermediaryService.dismissLoading();
    });
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
  selectTemplate(template:CalendarModel.Template):void{
    (<FormArray>this.form.get("warehouses")).controls.forEach(warehouseControl=>{
      template.warehouses.forEach(templateWarehouse=>{
        if(templateWarehouse.originWarehouse.id == warehouseControl.get("originWarehouse").value.id){
          templateWarehouse.warehousesDestinations.forEach(templateDestination=>{
            (<FormArray>warehouseControl.get("warehousesDestinations")).controls.forEach(destinationControl=>{
              if(destinationControl.get("id").value == templateDestination.destinationWarehouse.id)
                destinationControl.get("selected").setValue(true);
            })
          })
        }
      })
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
              warehouse.warehousesDestinations.map(warehouse=>{
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
