import {Component, Input, OnInit} from '@angular/core';
import {ReturnModel} from "../../../../services/src/models/endpoints/Return";
import {environment} from "@suite/services";

@Component({
  selector: 'horizontal-images-list',
  templateUrl: './horizontal-images-list.component.html',
  styleUrls: ['./horizontal-images-list.component.scss']
})
export class HorizontalImagesListComponent implements OnInit {

  @Input() title: string = null;
  @Input() archives: ReturnModel.Files[] = [];

  private baseUrlPhoto = environment.apiBasePhoto;
  public imagesExtensions: string[] = ['.png', '.jpg', '.jpeg'];

  constructor() {}

  ngOnInit() {}

  public getPublicImagePath(imagePath: string) {
    return this.baseUrlPhoto + imagePath;
  }

  public getFileName(fileName: string) {
    const fileNameFound = fileName.match(/^file-\d*-(.*)/);
    if (fileNameFound && fileNameFound.length > 1) {
      return fileNameFound[1];
    }

    return fileName;
  }

  public isImage(extension: string) {
    return !!this.imagesExtensions.find(e => e == extension);
  }

  public isPdf(extension: string) {
    return extension == '.pdf';
  }
}
