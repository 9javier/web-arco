import {Component, Input, OnInit} from '@angular/core';
import {ReturnModel} from "../../../../../services/src/models/endpoints/Return";
import {environment} from "@suite/services";

@Component({
  selector: 'thumbnail-image',
  templateUrl: './thumbnail-image.component.html',
  styleUrls: ['./thumbnail-image.component.scss']
})
export class ThumbnailImageComponent implements OnInit {

  @Input() image: ReturnModel.Files = null;

  private baseUrlPhoto = environment.apiBasePhoto;

  constructor() {}

  ngOnInit() {}

  public getPublicImagePath(imagePath: string) {
    return this.baseUrlPhoto + imagePath;
  }
}
