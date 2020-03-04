import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'form-expedition-info',
  templateUrl: './form-expedition-info.component.html',
  styleUrls: ['./form-expedition-info.component.scss']
})
export class FormExpeditionInfoComponent implements OnInit, OnDestroy {

  @Output() checkExpedition: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputExpeditionNumber') inputExpeditionNumber: ElementRef;

  public expeditionForm: FormGroup = null;
  private subscriptionToFormChanges: Subscription = null;
  public checkingExpeditionInProcess: boolean = false;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.focusInExpeditionNumberInput();
  }

  ngOnDestroy() {
    if (this.subscriptionToFormChanges) {
      this.subscriptionToFormChanges.unsubscribe();
    }
  }

  public initForm() {
    this.expeditionForm = new FormGroup({
      number_expedition: new FormControl('')
    });
  }

  public focusInExpeditionNumberInput() {
    setTimeout(() => this.inputExpeditionNumber.nativeElement.focus(), 0.5 * 1000);
  }

  public check() {
    this.checkExpedition.next(this.expeditionForm.value);
  }
}
