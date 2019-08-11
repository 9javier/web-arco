import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder,FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BuildingModel, AgencyModel, AgencyService } from '@suite/services';

@Component({
  selector: 'suite-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {

  /**for send the data of the value */
  @Output() submit = new EventEmitter();

  @Input() set building(building){
    if(building)
      if(building.manageAgency){
        building.manageAgencyId = building.manageAgency.id;
      }
      this.form.patchValue(building);
  }

  agencies:Array<AgencyModel.Agency> = [];
  
  /**form to export data */
  form:FormGroup = this.formBuilder.group({
    id:[''],
    name:['',Validators.required],
    phone:['',Validators.required],
    address:['',Validators.required],
    manageAgencyId:['',Validators.required]
  });

  constructor(
    private agencyService:AgencyService,
    private formBuilder:FormBuilder,
    private modalController:ModalController) { }

  ngOnInit() {
    this.getAgencies();
  }


  getAgencies(){
    this.agencyService.getAll().subscribe(agencies=>{
      this.agencies = agencies;
    })
  }

   /**
    * close the current instance of update modal
    */
    close():void{
      this.modalController.dismiss();
    }

  /**
   * Send the data to the parent component
   */
  submitData():void{
    this.submit.emit(this.form.value);
  }

}
