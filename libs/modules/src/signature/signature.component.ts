import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'suite-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit,OnChanges {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  // signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
  //   'minWidth': 5,
  //   'canvasWidth': this.plt.width,
  //   'canvasHeight': 300
  // };
  dataUrl: string;
  constructor(private plt: Platform, private router: Router) {
   
   }

  ngOnInit() {
    console.log(this.plt.width());
    
    
  }

  ngOnChanges(){
    
  }
  
  ngAfterViewInit() {
    console.log(this.signaturePad);
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.set('canvasWidth', this.plt.width())
    this.signaturePad.set('canvasHeight', 300)
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    this.dataUrl = this.signaturePad.toDataURL('png')
    console.log(this.dataUrl);
    this.router.navigate(['incidents']);
    
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
   
  }

  clear() {
    this.signaturePad.clear()
  }

}
