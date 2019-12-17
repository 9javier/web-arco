/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExcellServiceService } from './excellService.service';

describe('Service: ExcellService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExcellServiceService]
    });
  });

  it('should ...', inject([ExcellServiceService], (service: ExcellServiceService) => {
    expect(service).toBeTruthy();
  }));
});
