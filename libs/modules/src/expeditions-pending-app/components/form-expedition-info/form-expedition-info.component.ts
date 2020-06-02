import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {KeyboardService} from "../../../../../services/src/lib/keyboard/keyboard.service";
import {LocalStorageProvider} from "../../../../../services/src/providers/local-storage/local-storage.provider";

@Component({
  selector: 'form-expedition-info',
  templateUrl: './form-expedition-info.component.html',
  styleUrls: ['./form-expedition-info.component.scss']
})
export class FormExpeditionInfoComponent implements OnInit, OnDestroy {

  @ViewChild('inputExpeditionNumber') inputExpeditionNumber: ElementRef;

  @Input() isReceptionWithoutOrder: boolean = false;
  @Output() checkExpedition: EventEmitter<any> = new EventEmitter();
  @Output() resumeLastExpedition: EventEmitter<any> = new EventEmitter();

  public expeditionForm: FormGroup = null;
  private subscriptionToFormChanges: Subscription = null;
  public checkingExpeditionInProcess: boolean = false;
  public checkingResumeExpeditionInProcess: boolean = false;
  public lastExpeditionQueried = {reference: null, providerId: null};

  constructor(
    private keyboardService: KeyboardService,
    private localStorageProvider: LocalStorageProvider
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.focusInExpeditionNumberInput();
    this.localStorageProvider.get('last_expedition').then(data => {
      this.lastExpeditionQueried = {reference: null, providerId: null};
      if (data) {
        const dataParsed = JSON.parse(String(data));
        if (dataParsed) {
          this.lastExpeditionQueried = dataParsed;
        }
      }
    });
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
    setTimeout(() => this.inputExpeditionNumber.nativeElement.focus(), 1000);
  }

  public resumeLast() {
    this.resumeLastExpedition.next(this.lastExpeditionQueried.reference);
  }

  public check() {
    this.checkExpedition.next(this.expeditionForm.value);
  }

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

  public keyUpInput(event) {
    if (event.keyCode == 13) {
      this.check();
    }
  }
}
