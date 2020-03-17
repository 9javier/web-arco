import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ReceptionAvelonModel} from "@suite/services";
import {parseDate} from "@ionic/core/dist/types/components/datetime/datetime-util";
import {DateTimeParserService} from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";
import {StatesExpeditionAvelonProvider} from "../../../../../services/src/providers/states-expetion-avelon/states-expedition-avelon.provider";
import {Type} from "../../enums/type.enum";
import {VirtualKeyboardService} from "../../../components/virtual-keyboard/virtual-keyboard.service";

@Component({
  selector: 'suite-info-header-reception',
  templateUrl: './info-header-reception.component.html',
  styleUrls: ['./info-header-reception.component.scss']
})
export class InfoHeaderReceptionComponent implements OnInit {

  @ViewChild('deliveryNote') deliveryNoteInput: ElementRef;

  @Input() isReceptionWithoutOrder: boolean = false;
  @Output() resetReception = new EventEmitter();
  @Output() changeDeliveryNote = new EventEmitter();

  packingsPallets: {packings: number, pallets: number};
  date: string;
  shipper: string;
  states: string;

  private _expeditionReference: string;
  get expeditionReference(): string {
    return this._expeditionReference;
  }
  set expeditionReference(value: string) {
    this._expeditionReference = value;
  }

  private _provider: ReceptionAvelonModel.Providers;
  get provider(): ReceptionAvelonModel.Providers {
    return this._provider;
  }
  set provider(value: ReceptionAvelonModel.Providers) {
    this._provider = value;
  }

  constructor(
    private virtualKeyboardService: VirtualKeyboardService,
    private stateExpeditionAvelonProvider: StatesExpeditionAvelonProvider
  ) { }

  ngOnInit() {}

  //region PUBLIC METHODS FOR VIEW
  public resetReceptionProcess() {
    this.resetReception.emit();
  }

  public showKeyboard() {
    const placeholderText = 'Nº ALBARÁN';
    const initialValue = this.deliveryNoteInput.nativeElement.value;

    const keyboardEventEmitterSubscribe = this.virtualKeyboardService.eventEmitter
      .subscribe(data => {
        if (data.selected) {
          this.deliveryNoteInput.nativeElement.value = data.selected.id;
          this.changeDeliveryNote.emit(this.deliveryNoteInput.nativeElement.value);
        }
      });

    this.virtualKeyboardService
      .openVirtualKeyboard({type: Type.DELIVERY_NOTE, placeholder: placeholderText, initialValue: initialValue})
      .then((popover: any) => {
        popover.onDidDismiss().then(() => {
          keyboardEventEmitterSubscribe.unsubscribe();
        });
      });
  }

  public removeDeliveryNote(event) {
    event.preventDefault();
    this.deliveryNoteInput.nativeElement.value = null;
    this.changeDeliveryNote.emit(this.deliveryNoteInput.nativeElement.value);
  }
  //endregion

  //region PUBLIC METHODS FOR USE FROM ANOTHER COMPONENTS/PAGES
  public loadInfoExpedition(expedition: {expeditionReference: string, provider: ReceptionAvelonModel.Providers, packingsPallets, date, shipper, states}, deliveryNote: string = null) {
    this.expeditionReference = expedition.expeditionReference;
    this.provider = expedition.provider;
    this.packingsPallets = expedition.packingsPallets;
    const formattedDate = new DateTimeParserService().date(expedition.date);
    if(formattedDate != 'Invalid date'){
      this.date = formattedDate;
    }
    this.shipper = expedition.shipper;
    this.states = this.stringStates(expedition.states);
    this.deliveryNoteInput.nativeElement.value = deliveryNote;
  }
  //endregion

  stringStates(states: number[]){
    return this.stateExpeditionAvelonProvider.getStringStates(states);
  }
}
