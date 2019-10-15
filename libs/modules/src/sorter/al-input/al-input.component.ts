import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatrixSorterModel} from "../../../../services/src/models/endpoints/MatrixSorter";
import {SorterProvider} from "../../../../services/src/providers/sorter/sorter.provider";
import {Router} from "@angular/router";
import {IntermediaryService} from "@suite/services";
import {SorterService} from "../../../../services/src/lib/endpoint/sorter/sorter.service";
import {SorterModel} from "../../../../services/src/models/endpoints/Sorter";
import {TemplateZonesService} from "../../../../services/src/lib/endpoint/template-zones/template-zones.service";
import {SorterTemplateService} from "../../../../services/src/lib/endpoint/sorter-template/sorter-template.service";
import {TemplateSorterModel} from "../../../../services/src/models/endpoints/TemplateSorter";
import {SorterExecutionService} from "../../../../services/src/lib/endpoint/sorter-execution/sorter-execution.service";
import {ExecutionSorterModel} from "../../../../services/src/models/endpoints/ExecutionSorter";
import {Events} from "@ionic/angular";
import {TemplateColorsService} from "../../../../services/src/lib/endpoint/template-colors/template-colors.service";
import {TemplateColorsModel} from "../../../../services/src/models/endpoints/TemplateColors";

@Component({
  selector: 'sorter-input-al',
  templateUrl: './al-input.component.html',
  styleUrls: ['./al-input.component.scss']
})
export class AlInputSorterComponent implements OnInit, OnDestroy {

  private DRAW_TEMPLATE_MATRIX: string = 'draw_template_matrix';

  private activeDefaultData: boolean = false;

  public colorsSelectors: TemplateColorsModel.AvailableColorsByProcess[] = [];
  public sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[] = [];
  public loadingSorterTemplateMatrix: boolean = true;
  private isTemplateWithEqualZones: boolean = false;

  constructor(
    private router: Router,
    private events: Events,
    private intermediaryService: IntermediaryService,
    private sorterService: SorterService,
    private templateZonesService: TemplateZonesService,
    private sorterTemplateService: SorterTemplateService,
    private sorterExecutionService: SorterExecutionService,
    private templateColorsService: TemplateColorsService,
    public sorterProvider: SorterProvider
  ) { }
  
  ngOnInit() {
    this.isTemplateWithEqualZones = false;
    if (this.activeDefaultData) {
      this.loadDefaultData();
    } else {
      this.loadingSorterTemplateMatrix = true;
      this.loadData();
    }
  }

  ngOnDestroy() {
    // Stop the execution color for user
    this.stopExecutionColor(false);
  }

  private loadDefaultData() {
    this.colorsSelectors = [
      {
        id: 1,
        name: "Yellow",
        hex: '#FFE600',
        available: '1'
      },
      {
        id: 2,
        name: "Green",
        hex: '#0C9D58',
        available: '1'
      },
      {
        id: 3,
        name: "Red",
        hex: '#DB4437',
        available: '1'
      },
      {
        id: 4,
        name: "Blue",
        hex: '#1B91FF',
        available: '1'
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
    this.events.publish(this.DRAW_TEMPLATE_MATRIX, this.sorterTemplateMatrix);
  }

  private loadData() {
    this.loadActiveSorter();
    this.checkActiveColor();
  }

  colorSelected(data) {
    this.sorterProvider.colorSelected = data;
  }

  zoneSelected(data) {
    this.sorterProvider.idZoneSelected = data;
  }

  sorterOperationCancelled() {
    this.sorterProvider.colorSelected = null;
    this.sorterProvider.idZoneSelected = null;
  }

  showButtonsFooter() : boolean {
    if (this.isTemplateWithEqualZones && this.sorterProvider.colorSelected && this.sorterProvider.idZoneSelected) {
      return true;
    } else if (!this.isTemplateWithEqualZones && this.sorterProvider.colorSelected) {
      return true;
    } else {
      return false;
    }
  }

  async sorterOperationStarted() {
    if (!this.sorterProvider.colorSelected) {
      await this.intermediaryService.presentToastError('Selecciona un color para comenzar.');
      return;
    }

    await this.intermediaryService.presentLoading('Iniciando proceso...');

    let paramsRequest: ExecutionSorterModel.ParamsExecuteColor = {
      color: this.sorterProvider.colorSelected.id,
      type: 1
    };

    if (this.sorterProvider.idZoneSelected) {
      paramsRequest.idZone = this.sorterProvider.idZoneSelected
    }

    this.sorterExecutionService
      .postExecuteColor(paramsRequest)
      .subscribe(async (res: ExecutionSorterModel.ExecuteColor) => {
        await this.intermediaryService.presentToastSuccess(`Comenzando proceso en el sorter con el color ${this.sorterProvider.colorSelected.name}`);
        this.sorterProvider.colorActiveForUser = this.sorterProvider.colorSelected.hex;
        this.router.navigate(['sorter/input/scanner']);
        await this.intermediaryService.dismissLoading();
      }, async (error) => {
        console.error('Error::Subscribe::sorterExecutionService::postExecuteColor', error);
        await this.intermediaryService.presentToastError(`Ha ocurrido un error al intentar iniciar el proceso con el color ${this.sorterProvider.colorSelected.name}`);
        await this.intermediaryService.dismissLoading();
      });
  }

  async actionLaunched() {
    this.intermediaryService.presentConfirm(
      'Va a finalizar el proceso activo actualmente para el usuario. <br/>¿Está seguro de querer hacerlo?',
      () => this.stopExecutionColor(true)
    );
  }

  //region Endpoints requests
  private loadActiveSorter() {
    this.sorterService
      .getFirstSorter()
      .subscribe((res: SorterModel.FirstSorter) => {
        this.loadAvailableColors(res.id);
      }, async (error) => {
        console.error('Error::Subscribe::sorterService::getFirstSorter', error);
        await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar cargar los datos del sorter.');
        this.loadingSorterTemplateMatrix = false;
      });
  }

  private checkActiveColor() {
    this.sorterExecutionService
      .getColorActive()
      .then((res: ExecutionSorterModel.ResponseColorActive) => {
        if (res.code == 201) {
          this.sorterProvider.colorActiveForUser = res.data.color.hex;
        } else {
          this.sorterProvider.colorActiveForUser = null;
        }
      }, async (error) => {
        console.error('Error::Rejected::sorterExecutionService::getColorActive', error);
        this.sorterProvider.colorActiveForUser = null;
      })
      .catch(async (error) => {
        console.error('Error::Catch::sorterExecutionService::getColorActive', error);
        this.sorterProvider.colorActiveForUser = null;
      });
  }

  private loadAvailableColors(idSorter: number) {
    this.templateColorsService
      .postAvailableColorsByProcess({ processType: 1 })
      .subscribe((res: TemplateColorsModel.AvailableColorsByProcess[]) => {
        this.colorsSelectors = res;
        this.loadActiveTemplate(idSorter);
      }, async (error) => {
        console.error('Error::Subscribe::templateColorsService::postAvailableColorsByProcess', error);
        await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar cargar los datos del sorter.');
        this.loadingSorterTemplateMatrix = false;
      });
  }

  private loadActiveTemplate(idSorter: number) {
    this.sorterTemplateService
      .getActiveTemplate()
      .subscribe((res: TemplateSorterModel.Template) => {
        this.isTemplateWithEqualZones = res.equalParts;
        this.loadMatrixTemplateSorter(idSorter, res.id);
      }, async (error) => {
        console.error('Error::Subscribe::sorterTemplateService::getActiveTemplate', error);
        await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar cargar la plantilla actual del sorter.');
        this.loadingSorterTemplateMatrix = false;
      });
  }

  private loadMatrixTemplateSorter(idSorter: number, idTemplate: number) {
    this.loadingSorterTemplateMatrix = true;
    this.templateZonesService
      .getMatrixTemplateSorter(idSorter, idTemplate)
      .subscribe((res: MatrixSorterModel.MatrixTemplateSorter[]) => {
        this.sorterTemplateMatrix = res;
        this.events.publish(this.DRAW_TEMPLATE_MATRIX, this.sorterTemplateMatrix);
        this.loadingSorterTemplateMatrix = false;
      }, async (error) => {
        console.error('Error::Subscribe::templateZonesService::getMatrixTemplateSorter', error);
        await this.intermediaryService.presentToastError('Ha ocurrido un error al intentar cargar la plantilla actual del sorter.');
        this.loadingSorterTemplateMatrix = false;
      });
  }

  private async stopExecutionColor(waitingResponse: boolean) {
    if (waitingResponse) {
      await this.intermediaryService.presentLoading('Finalizando proceso actual...');
    }
    this.sorterExecutionService
      .postStopExecuteColor()
      .subscribe(async (res: ExecutionSorterModel.StopExecuteColor) => {
        this.sorterProvider.colorActiveForUser = null;
        if (waitingResponse) {
          await this.intermediaryService.dismissLoading();
          await this.intermediaryService.presentToastSuccess('Proceso finalizado', 1500);
          this.loadingSorterTemplateMatrix = true;
          this.loadData();
          this.sorterOperationCancelled();
        }
      }, (error) => {
        console.error('Error::Subscribe::sorterExecutionService::postStopExecuteColor', error);
      });
  }
  //endregion
}
