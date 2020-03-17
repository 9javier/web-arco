import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {KeyboardService} from "../../../../../services/src/lib/keyboard/keyboard.service";

@Component({
  selector: 'form-expedition-info',
  templateUrl: './form-expedition-info.component.html',
  styleUrls: ['./form-expedition-info.component.scss']
})
export class FormExpeditionInfoComponent implements OnInit, OnDestroy {

  @ViewChild('inputExpeditionNumber') inputExpeditionNumber: ElementRef;

  @Input() isReceptionWithoutOrder: boolean = false;
  @Output() checkExpedition: EventEmitter<any> = new EventEmitter();

  public expeditionForm: FormGroup = null;
  private subscriptionToFormChanges: Subscription = null;
  public checkingExpeditionInProcess: boolean = false;

  constructor(
    private keyboardService: KeyboardService,
  ) {
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

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }
}
