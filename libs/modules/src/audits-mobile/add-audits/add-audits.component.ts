import { Component, OnInit } from '@angular/core';
import { AuditsService } from '@suite/services';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

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
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  userTyping(event: any){
    console.log(event.target.value);
    this.create();
  }


  create(){
    this.audit.create({packingReference:this.inputValue,status:1}).subscribe(res =>{
      console.log(res);
      this.presentToast('Creada con exito!!','success');
      this.router.navigateByUrl('/audits/scanner-product/'+res.data.id+'/'+this.inputValue+'/'+this.activeRoute.snapshot.routeConfig.path);
    },err=>{
      this.presentToast(err.error.result.reason,'danger');
    })
  }

  async presentToast(message,color) {
    const toast = await this.toast.create({
      message: message,
      color: color,
      duration: 4000
    });
    toast.present();
  }

}
