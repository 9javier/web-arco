import {Component, Input, OnInit} from '@angular/core';
import {PickingNewProductsModel} from "../../../../../services/src/models/endpoints/PickingNewProducts";
import {DateTimeParserService} from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";
import {environment} from "../../../../../services/src/environments/environment";

@Component({
  selector: 'received-product-template',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ReceivedProductTemplateComponent implements OnInit {

  @Input() productReceived: PickingNewProductsModel.ProductReceivedSearched;
  @Input() selectedFormControl: any;

  constructor(
    private dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {

  }

  processDate() {
    return this.dateTimeParserService.date(this.productReceived.createdAt);
  }

  getPhotoUrl(): string|boolean {
    if (this.productReceived.model && this.productReceived.model.has_photos && this.productReceived.model.photos.length > 0) {
      return environment.urlBase + this.productReceived.model.photos[0].urn;
    }

    return false;
  }

  getFamilyAndLifestyle(): string {
    let familyLifestyle: string[] = [];
    if (this.productReceived.model.family) {
      familyLifestyle.push(this.productReceived.model.family.name);
    }
    if (this.productReceived.model.lifestyle) {
      familyLifestyle.push(this.productReceived.model.lifestyle.name);
    }
    return familyLifestyle.join(' - ');
  }

  processProductSizesRange(): string {
    let sizesRange = '';

    if (this.productReceived.rangesNumbers) {
      if (this.productReceived.rangesNumbers.sizeRangeNumberMin && this.productReceived.rangesNumbers.sizeRangeNumberMax && this.productReceived.rangesNumbers.sizeRangeNumberMin == this.productReceived.rangesNumbers.sizeRangeNumberMax) {
        sizesRange = this.productReceived.rangesNumbers.sizeRangeNumberMin;
      } else {
        sizesRange = this.productReceived.rangesNumbers.sizeRangeNumberMin + '-' + this.productReceived.rangesNumbers.sizeRangeNumberMax;
      }
    } else {
      sizesRange = '';
    }

    return sizesRange;
  }

  getFinalPrice(): string {
    if (this.productReceived.filterPrice.priceOriginal) {
      if (this.productReceived.filterPrice.priceDiscountOutlet && this.productReceived.filterPrice.priceDiscountOutlet != '0.00' && this.productReceived.filterPrice.priceDiscountOutlet != '0,00' && this.productReceived.filterPrice.priceOriginal != this.productReceived.filterPrice.priceDiscountOutlet) {
        return this.productReceived.filterPrice.priceDiscountOutlet;
      } else if (this.productReceived.filterPrice.priceDiscount && this.productReceived.filterPrice.priceDiscount != '0.00' && this.productReceived.filterPrice.priceDiscount != '0,00' && this.productReceived.filterPrice.priceOriginal != this.productReceived.filterPrice.priceDiscount) {
        return this.productReceived.filterPrice.priceDiscount;
      } else {
        return this.productReceived.filterPrice.priceOriginal;
      }
    }

    return '';
  }

}
