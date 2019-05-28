import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'suite-workwave-template',
  templateUrl: './workwave-template.component.html',
  styleUrls: ['./workwave-template.component.scss']
})
export class WorkwaveTemplateComponent implements OnInit {

  /*
   * 1 _ Ejecución al momento
   * 2 _ Programada
   * 3 _ Plantilla
   * 4 _ Programada todos los días
   */
  private typeWorkwave: number;
  private workwaveToEdit = null;

  constructor(
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      this.typeWorkwave = params.type;
      if (params.workwave) {
        this.workwaveToEdit = JSON.parse(params.workwave);
      }
    });
  }

}
