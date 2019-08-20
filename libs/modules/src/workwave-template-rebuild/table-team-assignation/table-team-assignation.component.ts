import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'table-team-assignation',
  templateUrl: './table-team-assignation.component.html',
  styleUrls: ['./table-team-assignation.component.scss']
})
export class TableTeamAssignationComponent implements OnInit {

  listTeamAssignations: any[] = [];

  private maxQuantityAssignations: number = 0;
  maxSizeForCols: number = 12;
  maxSizeForNameCol: number = 2;

  constructor() {}

  ngOnInit() {
    this.listTeamAssignations = [
      {
        "user": {
          "id": 1,
          "email": "admin@krackonline.com",
          "name": "Administrator",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": false
        },
        "pickingShoes": [
          {
            "pickingId": 1,
            "quantityShoes": "18",
            "Temporal": false
          },
          {
            "pickingId": 2,
            "quantityShoes": "21",
            "Temporal": false
          },
          {
            "pickingId": 3,
            "quantityShoes": "2",
            "Temporal": false
          },
          {
            "pickingId": 4,
            "quantityShoes": "12",
            "Temporal": false
          },
          {
            "pickingId": 38,
            "quantityShoes": "20",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 3,
          "email": "ivan@ivan.com",
          "name": "Ivan",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 36,
            "quantityShoes": "20",
            "Temporal": true
          },
          {
            "pickingId": 37,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 4,
          "email": "sofi@sofi.com",
          "name": "Sofi",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 35,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 1,
          "email": "admin@krackonline.com",
          "name": "Administrator",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": false
        },
        "pickingShoes": [
          {
            "pickingId": 1,
            "quantityShoes": "18",
            "Temporal": false
          },
          {
            "pickingId": 2,
            "quantityShoes": "21",
            "Temporal": false
          },
          {
            "pickingId": 3,
            "quantityShoes": "2",
            "Temporal": false
          },
          {
            "pickingId": 4,
            "quantityShoes": "12",
            "Temporal": false
          },
          {
            "pickingId": 38,
            "quantityShoes": "20",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 3,
          "email": "ivan@ivan.com",
          "name": "Ivan",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 36,
            "quantityShoes": "20",
            "Temporal": true
          },
          {
            "pickingId": 37,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 4,
          "email": "sofi@sofi.com",
          "name": "Sofi",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 35,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 3,
          "email": "ivan@ivan.com",
          "name": "Ivan",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 36,
            "quantityShoes": "20",
            "Temporal": true
          },
          {
            "pickingId": 37,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 4,
          "email": "sofi@sofi.com",
          "name": "Sofi",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 35,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 1,
          "email": "admin@krackonline.com",
          "name": "Administrator",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": false
        },
        "pickingShoes": [
          {
            "pickingId": 1,
            "quantityShoes": "18",
            "Temporal": false
          },
          {
            "pickingId": 2,
            "quantityShoes": "21",
            "Temporal": false
          },
          {
            "pickingId": 3,
            "quantityShoes": "2",
            "Temporal": false
          },
          {
            "pickingId": 4,
            "quantityShoes": "12",
            "Temporal": false
          },
          {
            "pickingId": 38,
            "quantityShoes": "20",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 3,
          "email": "ivan@ivan.com",
          "name": "Ivan",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 36,
            "quantityShoes": "20",
            "Temporal": true
          },
          {
            "pickingId": 37,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 4,
          "email": "sofi@sofi.com",
          "name": "Sofi",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 35,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 3,
          "email": "ivan@ivan.com",
          "name": "Ivan",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 36,
            "quantityShoes": "20",
            "Temporal": true
          },
          {
            "pickingId": 37,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 4,
          "email": "sofi@sofi.com",
          "name": "Sofi",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 35,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 1,
          "email": "admin@krackonline.com",
          "name": "Administrator",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": false
        },
        "pickingShoes": [
          {
            "pickingId": 1,
            "quantityShoes": "18",
            "Temporal": false
          },
          {
            "pickingId": 2,
            "quantityShoes": "21",
            "Temporal": false
          },
          {
            "pickingId": 3,
            "quantityShoes": "2",
            "Temporal": false
          },
          {
            "pickingId": 4,
            "quantityShoes": "12",
            "Temporal": false
          },
          {
            "pickingId": 38,
            "quantityShoes": "20",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 3,
          "email": "ivan@ivan.com",
          "name": "Ivan",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 36,
            "quantityShoes": "20",
            "Temporal": true
          },
          {
            "pickingId": 37,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      },
      {
        "user": {
          "id": 4,
          "email": "sofi@sofi.com",
          "name": "Sofi",
          "address": null,
          "phone": null,
          "employedId": null,
          "hasWarehouse": true
        },
        "pickingShoes": [
          {
            "pickingId": 35,
            "quantityShoes": "25",
            "Temporal": true
          }
        ]
      }
    ];

    for (let teamAssignation of this.listTeamAssignations) {
      let tempMaxCount = 0;
      for (let assignation of teamAssignation.pickingShoes) {
        tempMaxCount += parseInt(assignation.quantityShoes);
      }
      if (tempMaxCount > this.maxQuantityAssignations) {
        this.maxQuantityAssignations = tempMaxCount;
      }
    }

    this.maxSizeForCols = this.maxQuantityAssignations + (this.maxQuantityAssignations * 0.2);
    this.maxSizeForNameCol = this.maxQuantityAssignations * 0.2;
  }

}
