import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'table-stores',
  templateUrl: './table-stores.component.html',
  styleUrls: ['./table-stores.component.scss']
})
export class TableStoresComponent implements OnInit {

  warehouseId = 1;
  listGroupWarehouses: any[] = [];

  constructor() {}

  ngOnInit() {
    this.listGroupWarehouses = [
      {
        name: "Galicia Sur",
        reference: "00A",
        id: 1,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "01A",
        id: 2,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "02A",
        id: 3,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "03A",
        id: 4,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "04A",
        id: 5,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "05A",
        id: 6,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "06A",
        id: 7,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "07A",
        id: 8,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "08A",
        id: 9,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "09A",
        id: 10,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "10A",
        id: 11,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "11A",
        id: 12,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "12A",
        id: 13,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "13A",
        id: 14,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "14A",
        id: 15,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "15A",
        id: 16,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "16A",
        id: 17,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "17A",
        id: 18,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "18A",
        id: 19,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "19A",
        id: 20,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "20A",
        id: 21,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "21A",
        id: 22,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "22A",
        id: 23,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "23A",
        id: 24,
        consolidation: 0
      },
      {
        name: "Galicia Sur",
        reference: "24A",
        id: 25,
        consolidation: 0
      }
    ]
  }

}
