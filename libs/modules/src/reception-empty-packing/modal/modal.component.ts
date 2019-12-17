import {Router} from '@angular/router';
import {IntermediaryService} from './../../../../services/src/lib/endpoint/intermediary/intermediary.service';
import {CarrierService} from '@suite/services';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {KeyboardService} from 'libs/services/src/lib/keyboard/keyboard.service';
import {Subscription} from 'rxjs';
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";

@Component({
  selector: 'suite-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  reference: string;
  empty$: Subscription;
  reception$: Subscription;

  constructor(
    private keyboardService: KeyboardService,
    private carrierService: CarrierService,
    private intermediaryService: IntermediaryService,
    private router: Router,
    private audioProvider: AudioProvider
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.empty$) {
      this.empty$.unsubscribe();
    }
    if (this.reception$) {
      this.reception$.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.focusToInput();
  }

  private focusToInput() {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    }, 500);
  }

  close() {
    this.router.navigate(['/packing/carrierEmptyPacking']);
  }

  keyUpInput(e) {
    if (e.keyCode == 13) {
      let reference = this.reference;
      this.reference = null;
      this.sendReference(reference)
    }
  }

  public onFocus(event) {
    if (event && event.target && event.target.id) {
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

  sendReference(reference) {
    const body = {
      packingReference: reference
    };

    this.reception$ = this.carrierService.getReceptions(body).subscribe(
      (receptions) => {
        this.audioProvider.playDefaultOk();
        this.intermediaryService.presentToastSuccess(`Se ha registrado la recepción del embalaje ${reference}.`);
        this.focusToInput();
      },
      (e) => {
        this.audioProvider.playDefaultError();
        let errorMessage = `Ha ocurrido un error al intentar recepcionar el embalaje ${reference}.`;
        if (e.error && e.error.errors) {
          errorMessage = e.error.errors;
        }
        this.intermediaryService.presentToastError(errorMessage);
        this.focusToInput();
      }
    )
  }
}

