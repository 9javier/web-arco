import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardFilteringService {
  public items: any = [];

  constructor() {
    this.items = [];
  }

  setItems(items: any[]) {
    this.items = items
  }

  filterItems(searchTerm) {
    return this.items.filter(item => {
      return item.value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
