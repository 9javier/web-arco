import { Injectable } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Subscription } from 'rxjs';
/**
 * @author Daniel Salazar
 * @type servicio
 * @description Servicio para inhabilitar el teclado en la version movil AL en el reetiquetado
 */
@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private event;
  private state: boolean;
  private inputFocused: string;

  input: HTMLElement;
  constructor(private keyboard: Keyboard) {
    this.state = false
  }

  disabled() {
    this.state = false;
    const id = this.getInputFocused();
    this.input = document.getElementById(id);
    if (this.input) {
      this.input.setAttribute('hideKeyboard', "");
    }

  }

  eneabled() {
    const id = this.getInputFocused();
    this.input = document.getElementById(id);
    this.state = true;
    if (this.input) {
      this.input.removeAttribute('hideKeyboard');
      this.input.focus();
      setTimeout(()=>{
        this.keyboard.show();
      }, 500);
    }
  }

  isEneabled() {
    return this.state;
  }


  private disabledKeyboard(ev) {
    // console.log('ev');
    const id = document.activeElement.id;
    this.input = document.getElementById(id);
    // console.log('input', this.input);
    if (this.input !== null) {
      this.input.setAttribute('readonly', '');
    }
    setTimeout(() => {
      if (this.input !== null) {
        // console.log('remove readonly');
        this.input.removeAttribute('readonly');
      }

    }, 500)
  }

  setInputFocused(id: string): void{
    this.inputFocused = id;
  }

  getInputFocused() :string{
    return this.inputFocused;
  }

}
