import { Component, OnInit } from '@angular/core';
import { AuditsService } from '@suite/services';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";

@Component({
  selector: 'suite-add-audits',
  templateUrl: './add-audits.component.html',
  styleUrls: ['./add-audits.component.scss']
})
export class AddAuditsComponent implements OnInit {

  public inputValue: string = null;

  constructor(
    private audit : AuditsService,
    private toast : ToastController,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private audioProvider: AudioProvider
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

  userTyping(event: any){
    let codeScanned = this.inputValue;
    this.inputValue = null;
    this.create(codeScanned);
  }

  create(codeScanned: string){
    this.audit.create({packingReference:codeScanned,status:1}).subscribe(res =>{
      this.audioProvider.playDefaultOk();
      this.presentToast(`Iniciada validación de ${codeScanned}`,'success');
      setTimeout(() => {
        this.presentToast('Escanea los productos del embalaje','success');
      }, 2 * 1000);
      this.router.navigateByUrl('/audits/scanner-product/'+res.data.id+'/'+codeScanned+'/'+this.activeRoute.snapshot.routeConfig.path);
    },err=>{
      this.audioProvider.playDefaultError();
      this.focusToInput();
      this.presentToast(err.error.errors,'danger');
    })
  }

  async presentToast(message,color) {
    const toast = await this.toast.create({
      message: message,
      color: color,
      duration: 2000
    });
    toast.present();
  }

}
