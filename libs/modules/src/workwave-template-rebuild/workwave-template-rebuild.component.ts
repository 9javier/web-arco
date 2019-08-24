import { Component, OnInit } from '@angular/core';
import {WorkwavesService} from "../../../services/src/lib/endpoint/workwaves/workwaves.service";

@Component({
  selector: 'suite-workwave-template-rebuild',
  templateUrl: './workwave-template-rebuild.component.html',
  styleUrls: ['./workwave-template-rebuild.component.scss']
})
export class WorkwaveTemplateRebuildComponent implements OnInit {

  public workwaveToEdit = null;

  constructor(private workwaveService: WorkwavesService) {}

  ngOnInit() {
    this.workwaveToEdit = this.workwaveService.lastWorkwaveRebuildEdited;
  }

}
