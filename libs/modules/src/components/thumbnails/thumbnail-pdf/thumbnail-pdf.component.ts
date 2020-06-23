import {Component, Input, OnInit} from '@angular/core';
import {ReturnModel} from "../../../../../services/src/models/endpoints/Return";

@Component({
  selector: 'thumbnail-pdf',
  templateUrl: './thumbnail-pdf.component.html',
  styleUrls: ['./thumbnail-pdf.component.scss']
})
export class ThumbnailPdfComponent implements OnInit {

  @Input() archive: ReturnModel.Files = null;

  constructor() {}

  ngOnInit() {}

  public getFileName(fileName: string) {
    const fileNameFound = fileName.match(/^file-\d*-(.*)/);
    if (fileNameFound && fileNameFound.length > 1) {
      return fileNameFound[1];
    }

    return fileName;
  }
}
