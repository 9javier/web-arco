import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ReceptionProvider {

  private _processStarted: boolean = false;
  get processStarted(): boolean {
    return this._processStarted;
  }
  set processStarted(value: boolean) {
    this._processStarted = value;
  }

  private _typePacking: number = 0;
  get typePacking(): number {
    return this._typePacking;
  }
  set typePacking(value: number) {
    this._typePacking = value;
  }

  private _referencePacking: string;
  get referencePacking(): string {
    return this._referencePacking;
  }
  set referencePacking(value: string) {
    this._referencePacking = value;
  }

  private _literalsJailPallet: any = {
    1: {
      next_steps: `Para completar el proceso vuelve a escanear la jaula ${this._referencePacking} para validar la recepción de todos sus productos.`,
      next_steps_to_empty: `Para completar el proceso escanea los productos recibidos de la jaula uno a uno y finalice el proceso con el botón inferior.`,
      packing_emptied: `Jaula ${this._referencePacking} vaciada.`,
      reception_finished: 'Registrada la recepción de la jaula con ',
      reception_resumed: `Vuelve a escanear la jaula ${this._referencePacking} para continuar con la recepción`,
      reception_started: 'Recepción iniciada con la jaula ',
      warning_reception_all: 'Al escanear de nuevo la jaula sin haber escaneado ningún producto confirmará la recepción de todos los productos. ¿Confirmar la recepción?',
      wrong_packing_resume: 'Escanea la misma jaula para continuar la recepción.',
      wrong_packing_finish: 'Escanea la misma jaula para finalizar la recepción.'
    },
    'jail': {
      next_steps: `Para completar el proceso vuelve a escanear la jaula ${this._referencePacking} para validar la recepción de todos sus productos.`,
      next_steps_to_empty: `Para completar el proceso escanea los productos recibidos de la jaula uno a uno y finalice el proceso con el botón inferior.`,
      packing_emptied: `Jaula ${this._referencePacking} vaciada.`,
      reception_finished: 'Registrada la recepción de la jaula con ',
      reception_resumed: `Vuelve a escanear la jaula ${this._referencePacking} para continuar con la recepción`,
      reception_started: 'Recepción iniciada con la jaula ',
      warning_reception_all: 'Al escanear de nuevo la jaula sin haber escaneado ningún producto confirmará la recepción de todos los productos. ¿Confirmar la recepción?',
      wrong_packing_resume: 'Escanea la misma jaula para continuar la recepción.',
      wrong_packing_finish: 'Escanea la misma jaula para finalizar la recepción.'
    },
    2: {
      next_steps: `Para completar el proceso vuelve a escanear el pallet ${this._referencePacking} para validar la recepción de todos sus productos.`,
      next_steps_to_empty: `Para completar el proceso escanea los productos recibidos del pallet uno a uno y finalice el proceso con el botón inferior.`,
      packing_emptied: `Pallet ${this._referencePacking} vaciado.`,
      reception_finished: 'Registrada la recepción del pallet con ',
      reception_resumed: `Vuelve a escanear el pallet ${this._referencePacking} para continuar con la recepción`,
      reception_started: 'Recepción iniciada con el pallet ',
      warning_reception_all: 'Al escanear de nuevo el pallet sin haber escaneado ningún producto confirmará la recepción de todos los productos. ¿Confirmar la recepción?',
      wrong_packing_resume: 'Escanea el mismo pallet para continuar la recepción.',
      wrong_packing_finish: 'Escanea el mismo pallet para finalizar la recepción.'
    },
    'pallet': {
      next_steps: `Para completar el proceso vuelve a escanear el pallet ${this._referencePacking} para validar la recepción de todos sus productos.`,
      next_steps_to_empty: `Para completar el proceso escanea los productos recibidos del pallet uno a uno y finalice el proceso con el botón inferior.`,
      packing_emptied: `Pallet ${this._referencePacking} vaciado.`,
      reception_finished: 'Registrada la recepción del pallet con ',
      reception_resumed: `Vuelve a escanear el pallet ${this._referencePacking} para continuar con la recepción`,
      reception_started: 'Recepción iniciada con el pallet ',
      warning_reception_all: 'Al escanear de nuevo el pallet sin haber escaneado ningún producto confirmará la recepción de todos los productos. ¿Confirmar la recepción?',
      wrong_packing_resume: 'Escanea el mismo pallet para continuar la recepción.',
      wrong_packing_finish: 'Escanea el mismo pallet para finalizar la recepción.'
    }
  };
  get literalsJailPallet(): any {
    return this._literalsJailPallet[this.typePacking];
  }

  private _resumeProcessStarted: boolean = false;
  get resumeProcessStarted(): boolean {
    return this._resumeProcessStarted;
  }
  set resumeProcessStarted(value: boolean) {
    this._resumeProcessStarted = value;
  }

}
