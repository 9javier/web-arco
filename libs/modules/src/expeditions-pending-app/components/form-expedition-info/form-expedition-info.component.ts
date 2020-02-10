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

  public listProviders: {id: number, name: string}[] = [];
  private listProvidersOriginal: {id: number, name: string}[] = [];

  public expeditionForm: FormGroup = null;
  private subscriptionToFormChanges: Subscription = null;
  public checkingExpeditionInProcess: boolean = false;

  constructor() {
    this.expeditionForm = new FormGroup({
      number_expedition: new FormControl(''),
      provider_expedition: new FormControl('')
    });
  }

  ngOnInit() {
    this.loadProviders();
    this.listenFormChanges();
    setTimeout(() => this.inputExpeditionNumber.nativeElement.focus(), 0.5 * 1000);
  }

  ngOnDestroy() {
    if (this.subscriptionToFormChanges) {
      this.subscriptionToFormChanges.unsubscribe();
    }
  }

  private loadProviders() {
    const dataTest = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
         Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
         Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
         Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
         North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
         South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
         Wisconsin, Wyoming';
    this.listProviders = dataTest.split(/, +/g).map(function (state, i) {
      return {
        id: i,
        name: state
      };
    });
    this.listProvidersOriginal = this.copyItem(this.listProviders);
  }

  private listenFormChanges() {
    this.subscriptionToFormChanges = this.expeditionForm.valueChanges.subscribe((c) => {
      if (!c.provider_expedition) {
        if (this.listProviders.length != this.listProvidersOriginal.length) {
          this.listProviders = this.copyItem(this.listProvidersOriginal);
        }
      } else {
        const listProvidersTemp = this.copyItem(this.listProvidersOriginal);
        this.listProviders = listProvidersTemp.filter((s) => {
          return s.name.toUpperCase().includes(c.provider_expedition.toUpperCase());
        });
      }
    });
  }

  public check() {
    this.checkExpedition.next(this.expeditionForm.getRawValue());
  }

  private copyItem(original) {
    return JSON.parse(JSON.stringify(original));
  }
}
