import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WorkwavesService} from "../../../services/src/lib/endpoint/workwaves/workwaves.service";

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
  public typeWorkwave: number;
  public workwaveToEdit = null;

  constructor(
    private router: ActivatedRoute,
    private workwaveService: WorkwavesService
  ) {}

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      this.typeWorkwave = params.type;
    });
    this.workwaveToEdit = this.workwaveService.lastWorkwaveEdited;
  }

}
