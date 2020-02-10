import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {FormExpeditionInfoComponent} from "./components/form-expedition-info/form-expedition-info.component";
import {ExpeditionInfo, ExpeditionInfoComponent} from "./components/expedition-info/expedition-info.component";
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'suite-expeditions-pending-app',
  templateUrl: './expeditions-pending-app.component.html',
  styleUrls: ['./expeditions-pending-app.component.scss']
})
export class ExpeditionsPendingAppComponent implements OnInit, OnDestroy {

  @ViewChild(FormExpeditionInfoComponent) formExpeditionInfo: FormExpeditionInfoComponent;
  @ViewChild(ExpeditionInfoComponent) expeditionInfo: ExpeditionInfoComponent;

  public listProviders: {id: number, name: string}[] = [];
  private listProvidersOriginal: {id: number, name: string}[] = [];

  public expeditionForm: FormGroup = null;
  private subscriptionToFormChanges: Subscription = null;
  public checkingExpeditionInProcess: boolean = false;

  constructor(
    private router: Router,
    private dateTimeParserService: DateTimeParserService
  ) {
    this.expeditionForm = new FormGroup({
      number_expedition: new FormControl(''),
      provider_expedition: new FormControl('')
    });
  }

  ngOnInit() {
    this.loadProviders();
    this.listenFormChanges();
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

  public checkExpedition(data) {
    this.formExpeditionInfo.checkingExpeditionInProcess = true;
    setTimeout(() => {
      const newExpedition: ExpeditionInfo = {
        code: data.number_expedition,
        provider: data.provider_expedition,
        delivery_date: this.dateTimeParserService.date(new Date()),
        shipper: 'DHL',
        total_packing: 23,
        status_list: ['Enviado', 'Pendiente de recepción'],
        reception_enabled: true,
      };
      this.expeditionInfo.loadNewExpeditionInfo(newExpedition);
      this.formExpeditionInfo.checkingExpeditionInProcess = false;
    }, 5 * 1000);
  }

  public receptionExpedition(data) {
    this.router.navigate(['receptions-avelon', 'app']);
  }

  private copyItem(original) {
    return JSON.parse(JSON.stringify(original));
  }
}
