import { Injectable } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private $event: Subscription;
  private state: boolean
  constructor(private keyboard: Keyboard) { 
    this.state = false
    console.log(this.keyboard.isVisible)
  }

  disabled() {
    this.state = false;
    this.keyboard.hide()
    this.$event = this.keyboard.onKeyboardWillShow().subscribe(resp => {
      // this.ke
      // console.log('onKeyboardWillShow',resp);
      // console.log(resp.currentTarget.close());
      this.keyboard.hide();
    }); 
  }

  eneabled() {
    this.state = true;
    this.$event.unsubscribe();
    this.keyboard.show()
  }

  isEneabled() {
    return this.state;
  }
  

}
