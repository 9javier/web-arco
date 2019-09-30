import {Component, OnInit} from '@angular/core';
import {ColorSorterModel} from "../../../../services/src/models/endpoints/ColorSorter";
import {MatrixSorterModel} from "../../../../services/src/models/endpoints/MatrixSorter";
import {SorterProvider} from "../../../../services/src/providers/sorter/sorter.provider";
import {Router} from "@angular/router";
import {IntermediaryService} from "@suite/services";

@Component({
  selector: 'sorter-input-al',
  templateUrl: './al-input.component.html',
  styleUrls: ['./al-input.component.scss']
})
export class AlInputSorterComponent implements OnInit {

  public colorsSelectors: ColorSorterModel.ColorSorter[] = [];
  public sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[] = [];

  constructor(
    private router: Router,
    private intermediaryService: IntermediaryService,
    private sorterProvider: SorterProvider
  ) { }
  
  ngOnInit() {
    this.loadDefaultData();
  }

  loadDefaultData() {
    this.colorsSelectors = [
      {
        id: 1,
        name: "Yellow",
        hex: '#FFE600'
      },
      {
        id: 2,
        name: "Green",
        hex: '#0C9D58'
      },
      {
        id: 3,
        name: "Red",
        hex: '#DB4437'
      },
      {
        id: 4,
        name: "Blue",
        hex: '#1B91FF'
      }
    ];
    this.sorterTemplateMatrix = [
      {
        "height": 0,
        "columns": [
          {
            "column": 1,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 30,
              "name": "Sorter C",
              "number": 1,
              "active": true,
              "column": 1,
              "height": 1,
              "templateZone": {
                "createdAt": "2019-09-27T07:06:11.000Z",
                "updatedAt": "2019-09-27T07:06:11.000Z",
                "id": 1,
                "priority": 1,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:06:10.000Z",
                  "updatedAt": "2019-09-27T07:06:10.000Z",
                  "id": 1,
                  "name": "Zona Test",
                  "zoneNumber": 2,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:35.000Z",
                    "updatedAt": "2019-09-27T06:57:35.000Z",
                    "id": 2,
                    "name": "Color B",
                    "hex": "#FF0000"
                  }
                }
              }
            },
            "ways_number": 1
          },
          {
            "column": 2,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 31,
              "name": "Sorter C",
              "number": 2,
              "active": true,
              "column": 2,
              "height": 1,
              "templateZone": {
                "createdAt": "2019-09-27T07:06:11.000Z",
                "updatedAt": "2019-09-27T07:06:11.000Z",
                "id": 2,
                "priority": 2,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:06:10.000Z",
                  "updatedAt": "2019-09-27T07:06:10.000Z",
                  "id": 1,
                  "name": "Zona Test",
                  "zoneNumber": 2,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:35.000Z",
                    "updatedAt": "2019-09-27T06:57:35.000Z",
                    "id": 2,
                    "name": "Color B",
                    "hex": "#FF0000"
                  }
                }
              }
            },
            "ways_number": 2
          },
          {
            "column": 3,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 32,
              "name": "Sorter C",
              "number": 3,
              "active": true,
              "column": 3,
              "height": 1,
              "templateZone": {
                "createdAt": "2019-09-27T07:06:11.000Z",
                "updatedAt": "2019-09-27T07:06:11.000Z",
                "id": 3,
                "priority": 3,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:06:10.000Z",
                  "updatedAt": "2019-09-27T07:06:10.000Z",
                  "id": 1,
                  "name": "Zona Test",
                  "zoneNumber": 2,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:35.000Z",
                    "updatedAt": "2019-09-27T06:57:35.000Z",
                    "id": 2,
                    "name": "Color B",
                    "hex": "#FF0000"
                  }
                }
              }
            },
            "ways_number": 3
          },
          {
            "column": 4,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 33,
              "name": "Sorter C",
              "number": 4,
              "active": true,
              "column": 4,
              "height": 1,
              "templateZone": {
                "createdAt": "2019-09-27T07:06:11.000Z",
                "updatedAt": "2019-09-27T07:06:11.000Z",
                "id": 4,
                "priority": 4,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:06:10.000Z",
                  "updatedAt": "2019-09-27T07:06:10.000Z",
                  "id": 1,
                  "name": "Zona Test",
                  "zoneNumber": 2,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:35.000Z",
                    "updatedAt": "2019-09-27T06:57:35.000Z",
                    "id": 2,
                    "name": "Color B",
                    "hex": "#FF0000"
                  }
                }
              }
            },
            "ways_number": 4
          },
          {
            "column": 5,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 34,
              "name": "Sorter C",
              "number": 5,
              "active": true,
              "column": 5,
              "height": 1,
              "templateZone": {
                "createdAt": "2019-09-27T07:06:11.000Z",
                "updatedAt": "2019-09-27T07:06:11.000Z",
                "id": 5,
                "priority": 5,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:06:10.000Z",
                  "updatedAt": "2019-09-27T07:06:10.000Z",
                  "id": 1,
                  "name": "Zona Test",
                  "zoneNumber": 2,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:35.000Z",
                    "updatedAt": "2019-09-27T06:57:35.000Z",
                    "id": 2,
                    "name": "Color B",
                    "hex": "#FF0000"
                  }
                }
              }
            },
            "ways_number": 5
          }
        ]
      },
      {
        "height": 1,
        "columns": [
          {
            "column": 1,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 35,
              "name": "Sorter C",
              "number": 6,
              "active": true,
              "column": 1,
              "height": 2,
              "templateZone": {
                "createdAt": "2019-09-27T07:07:47.000Z",
                "updatedAt": "2019-09-27T07:07:47.000Z",
                "id": 6,
                "priority": 1,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:07:47.000Z",
                  "updatedAt": "2019-09-27T07:07:47.000Z",
                  "id": 4,
                  "name": "Zona Test Two",
                  "zoneNumber": 3,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:42.000Z",
                    "updatedAt": "2019-09-27T06:57:42.000Z",
                    "id": 3,
                    "name": "Color C",
                    "hex": "#00FF00"
                  }
                }
              }
            },
            "ways_number": 6
          },
          {
            "column": 2,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 36,
              "name": "Sorter C",
              "number": 7,
              "active": true,
              "column": 2,
              "height": 2,
              "templateZone": {
                "createdAt": "2019-09-27T07:07:47.000Z",
                "updatedAt": "2019-09-27T07:07:47.000Z",
                "id": 7,
                "priority": 2,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:07:47.000Z",
                  "updatedAt": "2019-09-27T07:07:47.000Z",
                  "id": 4,
                  "name": "Zona Test Two",
                  "zoneNumber": 3,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:42.000Z",
                    "updatedAt": "2019-09-27T06:57:42.000Z",
                    "id": 3,
                    "name": "Color C",
                    "hex": "#00FF00"
                  }
                }
              }
            },
            "ways_number": 7
          },
          {
            "column": 3,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 37,
              "name": "Sorter C",
              "number": 8,
              "active": true,
              "column": 3,
              "height": 2,
              "templateZone": {
                "createdAt": "2019-09-27T07:07:47.000Z",
                "updatedAt": "2019-09-27T07:07:47.000Z",
                "id": 8,
                "priority": 3,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:07:47.000Z",
                  "updatedAt": "2019-09-27T07:07:47.000Z",
                  "id": 4,
                  "name": "Zona Test Two",
                  "zoneNumber": 3,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:42.000Z",
                    "updatedAt": "2019-09-27T06:57:42.000Z",
                    "id": 3,
                    "name": "Color C",
                    "hex": "#00FF00"
                  }
                }
              }
            },
            "ways_number": 8
          },
          {
            "column": 4,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 38,
              "name": "Sorter C",
              "number": 9,
              "active": true,
              "column": 4,
              "height": 2,
              "templateZone": {
                "createdAt": "2019-09-27T07:07:48.000Z",
                "updatedAt": "2019-09-27T07:07:48.000Z",
                "id": 9,
                "priority": 4,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:07:47.000Z",
                  "updatedAt": "2019-09-27T07:07:47.000Z",
                  "id": 4,
                  "name": "Zona Test Two",
                  "zoneNumber": 3,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:42.000Z",
                    "updatedAt": "2019-09-27T06:57:42.000Z",
                    "id": 3,
                    "name": "Color C",
                    "hex": "#00FF00"
                  }
                }
              }
            },
            "ways_number": 9
          },
          {
            "column": 5,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 39,
              "name": "Sorter C",
              "number": 10,
              "active": true,
              "column": 5,
              "height": 2,
              "templateZone": {
                "createdAt": "2019-09-27T07:07:48.000Z",
                "updatedAt": "2019-09-27T07:07:48.000Z",
                "id": 10,
                "priority": 5,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:07:47.000Z",
                  "updatedAt": "2019-09-27T07:07:47.000Z",
                  "id": 4,
                  "name": "Zona Test Two",
                  "zoneNumber": 3,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:42.000Z",
                    "updatedAt": "2019-09-27T06:57:42.000Z",
                    "id": 3,
                    "name": "Color C",
                    "hex": "#00FF00"
                  }
                }
              }
            },
            "ways_number": 10
          }
        ]
      },
      {
        "height": 2,
        "columns": [
          {
            "column": 1,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 40,
              "name": "Sorter C",
              "number": 11,
              "active": true,
              "column": 1,
              "height": 3,
              "templateZone": null
            },
            "ways_number": 11
          },
          {
            "column": 2,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 41,
              "name": "Sorter C",
              "number": 12,
              "active": true,
              "column": 2,
              "height": 3,
              "templateZone": null
            },
            "ways_number": 12
          },
          {
            "column": 3,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 42,
              "name": "Sorter C",
              "number": 13,
              "active": true,
              "column": 3,
              "height": 3,
              "templateZone": null
            },
            "ways_number": 13
          },
          {
            "column": 4,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 43,
              "name": "Sorter C",
              "number": 14,
              "active": true,
              "column": 4,
              "height": 3,
              "templateZone": null
            },
            "ways_number": 14
          },
          {
            "column": 5,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 44,
              "name": "Sorter C",
              "number": 15,
              "active": true,
              "column": 5,
              "height": 3,
              "templateZone": null
            },
            "ways_number": 15
          }
        ]
      },
      {
        "height": 3,
        "columns": [
          {
            "column": 1,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 45,
              "name": "Sorter C",
              "number": 16,
              "active": true,
              "column": 1,
              "height": 4,
              "templateZone": null
            },
            "ways_number": 16
          },
          {
            "column": 2,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 46,
              "name": "Sorter C",
              "number": 17,
              "active": true,
              "column": 2,
              "height": 4,
              "templateZone": null
            },
            "ways_number": 17
          },
          {
            "column": 3,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 47,
              "name": "Sorter C",
              "number": 18,
              "active": true,
              "column": 3,
              "height": 4,
              "templateZone": null
            },
            "ways_number": 18
          },
          {
            "column": 4,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 48,
              "name": "Sorter C",
              "number": 19,
              "active": true,
              "column": 4,
              "height": 4,
              "templateZone": null
            },
            "ways_number": 19
          },
          {
            "column": 5,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 49,
              "name": "Sorter C",
              "number": 20,
              "active": true,
              "column": 5,
              "height": 4,
              "templateZone": null
            },
            "ways_number": 20
          }
        ]
      },
      {
        "height": 4,
        "columns": [
          {
            "column": 1,
            "way": {
              "createdAt": "2019-09-27T06:59:49.000Z",
              "updatedAt": "2019-09-27T06:59:49.000Z",
              "id": 50,
              "name": "Sorter C",
              "number": 21,
              "active": true,
              "column": 1,
              "height": 5,
              "templateZone": null
            },
            "ways_number": 21
          },
          {
            "column": 2,
            "way": {
              "createdAt": "2019-09-27T06:59:49.000Z",
              "updatedAt": "2019-09-27T06:59:49.000Z",
              "id": 51,
              "name": "Sorter C",
              "number": 22,
              "active": true,
              "column": 2,
              "height": 5,
              "templateZone": null
            },
            "ways_number": 22
          },
          {
            "column": 3,
            "way": {
              "createdAt": "2019-09-27T06:59:49.000Z",
              "updatedAt": "2019-09-27T06:59:49.000Z",
              "id": 52,
              "name": "Sorter C",
              "number": 23,
              "active": true,
              "column": 3,
              "height": 5,
              "templateZone": null
            },
            "ways_number": 23
          },
          {
            "column": 4,
            "way": {
              "createdAt": "2019-09-27T06:59:49.000Z",
              "updatedAt": "2019-09-27T06:59:49.000Z",
              "id": 53,
              "name": "Sorter C",
              "number": 24,
              "active": true,
              "column": 4,
              "height": 5,
              "templateZone": null
            },
            "ways_number": 24
          },
          {
            "column": 5,
            "way": {
              "createdAt": "2019-09-27T06:59:49.000Z",
              "updatedAt": "2019-09-27T06:59:49.000Z",
              "id": 54,
              "name": "Sorter C",
              "number": 25,
              "active": true,
              "column": 5,
              "height": 5,
              "templateZone": null
            },
            "ways_number": 25
          }
        ]
      },
      {
        "height": 0,
        "columns": [
          {
            "column": 1,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 30,
              "name": "Sorter C",
              "number": 1,
              "active": true,
              "column": 1,
              "height": 1,
              "templateZone": {
                "createdAt": "2019-09-27T07:06:11.000Z",
                "updatedAt": "2019-09-27T07:06:11.000Z",
                "id": 1,
                "priority": 1,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:06:10.000Z",
                  "updatedAt": "2019-09-27T07:06:10.000Z",
                  "id": 1,
                  "name": "Zona Test",
                  "zoneNumber": 2,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:35.000Z",
                    "updatedAt": "2019-09-27T06:57:35.000Z",
                    "id": 2,
                    "name": "Color B",
                    "hex": "#FF0000"
                  }
                }
              }
            },
            "ways_number": 1
          },
          {
            "column": 2,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 31,
              "name": "Sorter C",
              "number": 2,
              "active": true,
              "column": 2,
              "height": 1,
              "templateZone": {
                "createdAt": "2019-09-27T07:06:11.000Z",
                "updatedAt": "2019-09-27T07:06:11.000Z",
                "id": 2,
                "priority": 2,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:06:10.000Z",
                  "updatedAt": "2019-09-27T07:06:10.000Z",
                  "id": 1,
                  "name": "Zona Test",
                  "zoneNumber": 2,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:35.000Z",
                    "updatedAt": "2019-09-27T06:57:35.000Z",
                    "id": 2,
                    "name": "Color B",
                    "hex": "#FF0000"
                  }
                }
              }
            },
            "ways_number": 2
          },
          {
            "column": 3,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 32,
              "name": "Sorter C",
              "number": 3,
              "active": true,
              "column": 3,
              "height": 1,
              "templateZone": {
                "createdAt": "2019-09-27T07:06:11.000Z",
                "updatedAt": "2019-09-27T07:06:11.000Z",
                "id": 3,
                "priority": 3,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:06:10.000Z",
                  "updatedAt": "2019-09-27T07:06:10.000Z",
                  "id": 1,
                  "name": "Zona Test",
                  "zoneNumber": 2,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:35.000Z",
                    "updatedAt": "2019-09-27T06:57:35.000Z",
                    "id": 2,
                    "name": "Color B",
                    "hex": "#FF0000"
                  }
                }
              }
            },
            "ways_number": 3
          },
          {
            "column": 4,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 33,
              "name": "Sorter C",
              "number": 4,
              "active": true,
              "column": 4,
              "height": 1,
              "templateZone": {
                "createdAt": "2019-09-27T07:06:11.000Z",
                "updatedAt": "2019-09-27T07:06:11.000Z",
                "id": 4,
                "priority": 4,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:06:10.000Z",
                  "updatedAt": "2019-09-27T07:06:10.000Z",
                  "id": 1,
                  "name": "Zona Test",
                  "zoneNumber": 2,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:35.000Z",
                    "updatedAt": "2019-09-27T06:57:35.000Z",
                    "id": 2,
                    "name": "Color B",
                    "hex": "#FF0000"
                  }
                }
              }
            },
            "ways_number": 4
          },
          {
            "column": 5,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 34,
              "name": "Sorter C",
              "number": 5,
              "active": true,
              "column": 5,
              "height": 1,
              "templateZone": {
                "createdAt": "2019-09-27T07:06:11.000Z",
                "updatedAt": "2019-09-27T07:06:11.000Z",
                "id": 5,
                "priority": 5,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:06:10.000Z",
                  "updatedAt": "2019-09-27T07:06:10.000Z",
                  "id": 1,
                  "name": "Zona Test",
                  "zoneNumber": 2,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:35.000Z",
                    "updatedAt": "2019-09-27T06:57:35.000Z",
                    "id": 2,
                    "name": "Color B",
                    "hex": "#FF0000"
                  }
                }
              }
            },
            "ways_number": 5
          }
        ]
      },
      {
        "height": 1,
        "columns": [
          {
            "column": 1,
            "way": {
              "createdAt": "2019-09-27T06:59:47.000Z",
              "updatedAt": "2019-09-27T06:59:47.000Z",
              "id": 35,
              "name": "Sorter C",
              "number": 6,
              "active": true,
              "column": 1,
              "height": 2,
              "templateZone": {
                "createdAt": "2019-09-27T07:07:47.000Z",
                "updatedAt": "2019-09-27T07:07:47.000Z",
                "id": 6,
                "priority": 1,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:07:47.000Z",
                  "updatedAt": "2019-09-27T07:07:47.000Z",
                  "id": 4,
                  "name": "Zona Test Two",
                  "zoneNumber": 3,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:42.000Z",
                    "updatedAt": "2019-09-27T06:57:42.000Z",
                    "id": 3,
                    "name": "Color C",
                    "hex": "#00FF00"
                  }
                }
              }
            },
            "ways_number": 6
          },
          {
            "column": 2,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 36,
              "name": "Sorter C",
              "number": 7,
              "active": true,
              "column": 2,
              "height": 2,
              "templateZone": {
                "createdAt": "2019-09-27T07:07:47.000Z",
                "updatedAt": "2019-09-27T07:07:47.000Z",
                "id": 7,
                "priority": 2,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:07:47.000Z",
                  "updatedAt": "2019-09-27T07:07:47.000Z",
                  "id": 4,
                  "name": "Zona Test Two",
                  "zoneNumber": 3,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:42.000Z",
                    "updatedAt": "2019-09-27T06:57:42.000Z",
                    "id": 3,
                    "name": "Color C",
                    "hex": "#00FF00"
                  }
                }
              }
            },
            "ways_number": 7
          },
          {
            "column": 3,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 37,
              "name": "Sorter C",
              "number": 8,
              "active": true,
              "column": 3,
              "height": 2,
              "templateZone": {
                "createdAt": "2019-09-27T07:07:47.000Z",
                "updatedAt": "2019-09-27T07:07:47.000Z",
                "id": 8,
                "priority": 3,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:07:47.000Z",
                  "updatedAt": "2019-09-27T07:07:47.000Z",
                  "id": 4,
                  "name": "Zona Test Two",
                  "zoneNumber": 3,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:42.000Z",
                    "updatedAt": "2019-09-27T06:57:42.000Z",
                    "id": 3,
                    "name": "Color C",
                    "hex": "#00FF00"
                  }
                }
              }
            },
            "ways_number": 8
          },
          {
            "column": 4,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 38,
              "name": "Sorter C",
              "number": 9,
              "active": true,
              "column": 4,
              "height": 2,
              "templateZone": {
                "createdAt": "2019-09-27T07:07:48.000Z",
                "updatedAt": "2019-09-27T07:07:48.000Z",
                "id": 9,
                "priority": 4,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:07:47.000Z",
                  "updatedAt": "2019-09-27T07:07:47.000Z",
                  "id": 4,
                  "name": "Zona Test Two",
                  "zoneNumber": 3,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:42.000Z",
                    "updatedAt": "2019-09-27T06:57:42.000Z",
                    "id": 3,
                    "name": "Color C",
                    "hex": "#00FF00"
                  }
                }
              }
            },
            "ways_number": 9
          },
          {
            "column": 5,
            "way": {
              "createdAt": "2019-09-27T06:59:48.000Z",
              "updatedAt": "2019-09-27T06:59:48.000Z",
              "id": 39,
              "name": "Sorter C",
              "number": 10,
              "active": true,
              "column": 5,
              "height": 2,
              "templateZone": {
                "createdAt": "2019-09-27T07:07:48.000Z",
                "updatedAt": "2019-09-27T07:07:48.000Z",
                "id": 10,
                "priority": 5,
                "active": true,
                "template": {
                  "createdAt": "2019-09-27T07:02:28.000Z",
                  "updatedAt": "2019-09-27T07:02:28.000Z",
                  "id": 1,
                  "name": "Template Test",
                  "active": true
                },
                "zones": {
                  "createdAt": "2019-09-27T07:07:47.000Z",
                  "updatedAt": "2019-09-27T07:07:47.000Z",
                  "id": 4,
                  "name": "Zona Test Two",
                  "zoneNumber": 3,
                  "active": true,
                  "color": {
                    "createdAt": "2019-09-27T06:57:42.000Z",
                    "updatedAt": "2019-09-27T06:57:42.000Z",
                    "id": 3,
                    "name": "Color C",
                    "hex": "#00FF00"
                  }
                }
              }
            },
            "ways_number": 10
          }
        ]
      }
    ];
  }

  colorSelected(data) {
    this.sorterProvider.colorSelected = data;
  }

  sorterOperationCancelled() {
    this.sorterProvider.colorSelected = null;
  }

  async sorterOperationStarted() {
    if (!this.sorterProvider.colorSelected) {
      await this.intermediaryService.presentToastError('Selecciona un color para comenzar.');
      return;
    }

    this.router.navigate(['sorter/input/scanner']);
  }
}
