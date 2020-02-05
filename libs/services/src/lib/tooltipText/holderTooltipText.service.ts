import { Injectable } from '@angular/core';

const TIMETOPASS:number = 100;
const NOFCICLES:number = 5;

@Injectable({
  providedIn: 'root',
})
export class HolderTooltipText {

  showTooltipPrintPrices : boolean = false;
  elementoTouch:any;

  constructor(){}

  private isMobileDevice() {
    var ua = navigator.userAgent;

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua))
       return true;
    else if(/Chrome/i.test(ua))
       return false;
    else
       return true;
  }

  public async setTootlTip(idElement:string, isALOnly:boolean, txtElement?:string){



    if(txtElement != null || txtElement.length>0)
      document.getElementById(idElement).setAttribute('matTooltip', txtElement);


    console.log(this.isMobileDevice());

    if (this.isMobileDevice()){

      let intervalVar:any;
      document.getElementById(idElement).addEventListener('touchstart',function(e){
        document.getElementById(idElement).setAttribute('matTooltipDisabled', 'false');
        let counter:number = 0;
        intervalVar = window.setInterval(function(){
          counter++;
          if(counter == NOFCICLES){
            document.getElementById(idElement).setAttribute('matTooltipDisabled', 'true');
            window.clearInterval(intervalVar);
          }
        },TIMETOPASS);
      });

      document.getElementById(idElement).addEventListener('touchend', function(e){
        document.getElementById(idElement).setAttribute('matTooltipDisabled', 'false');
        clearInterval(intervalVar);
      }, false);

    }else{
      if(isALOnly){
        document.getElementById(idElement).setAttribute('matTooltipDisabled', 'true');
      }else
        document.getElementById(idElement).setAttribute('matTooltipDisabled', 'false');


    }


  }
}
