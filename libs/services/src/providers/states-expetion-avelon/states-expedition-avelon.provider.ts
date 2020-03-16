import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StatesExpeditionAvelonProvider {

  private _states: StateData[] = [];

  get states(): StateData[] {
    return this._states;
  }
  set states(value: StateData[]) {
    this._states = value;
  }

  getStateData(id: number) :StateData{
    return this.states.find(e => e.id == id);
  }

  getStringStates(states: number[]){
    const stringStates: string[] = [];
    for(let state of states){
      const stateData = this.getStateData(state);
      if(stateData){
        stringStates.push(stateData.name);
      }else{
        stringStates.push('Desconocido');
      }
    }
    return stringStates.join(', ');
  }

}

interface StateData {
  id: number,
  name: string,
  status: boolean
}
