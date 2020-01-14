import { Component, OnInit } from '@angular/core';
import { AuditsService, IntermediaryService } from '@suite/services';
import { Router, ActivatedRoute } from '@angular/router';
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {KeyboardService} from "../../../../services/src/lib/keyboard/keyboard.service";
import {ItemReferencesProvider} from "../../../../services/src/providers/item-references/item-references.provider";
import { TimesToastType } from '../../../../services/src/models/timesToastType';

@Component({
  selector: 'suite-add-audits',
  templateUrl: './add-audits.component.html',
  styleUrls: ['./add-audits.component.scss']
})
export class AddAuditsComponent implements OnInit {

  public inputValue: string = null;

  constructor(
    private audit : AuditsService,
    private intermediaryService : IntermediaryService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private audioProvider: AudioProvider,
    private itemReferencesProvider: ItemReferencesProvider,
    private keyboardService: KeyboardService
  ) {
    this.focusToInput();
  }

  ngOnInit() {
  }

  private focusToInput() {
    setTimeout(() => {
      document.getElementById('input').focus();
    }, 800);
  }

  userTyping(event: any) {
    let codeScanned = this.inputValue;
    this.inputValue = null;
    if (this.itemReferencesProvider.checkCodeValue(codeScanned) === this.itemReferencesProvider.codeValue.PACKING) {
      this.create(codeScanned);
    } else {
      this.focusToInput();
      this.audioProvider.playDefaultError();
      this.intermediaryService.presentToastError('Escanea un embalaje para comenzar la validación');
    }
  }

  create(codeScanned: string){
    this.audit.create({packingReference:codeScanned,status:1}).subscribe(res =>{
      this.audioProvider.playDefaultOk();
      this.intermediaryService.presentToastError(`Iniciada validación de ${codeScanned}`, TimesToastType.DURATION_SUCCESS_TOAST_3750);
      setTimeout(() => {
        this.intermediaryService.presentToastError('Escanea los productos del embalaje', TimesToastType.DURATION_SUCCESS_TOAST_3750);
      }, 2 * 1000);
      this.router.navigateByUrl('/audits/scanner-product/'+res.data.id+'/'+codeScanned+'/'+this.activeRoute.snapshot.routeConfig.path);
    },err=>{
      this.audioProvider.playDefaultError();
      this.focusToInput();
      this.intermediaryService.presentToastError(err.error.errors);
    })
  }

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

}
