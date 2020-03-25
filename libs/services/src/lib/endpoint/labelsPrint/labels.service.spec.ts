import { TestBed } from '@angular/core/testing';

import { LabelsPrintService } from './labelsPrint.service';

describe('LabelsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LabelsPrintService = TestBed.get(LabelsPrintService);
    expect(service).toBeTruthy();
  });
});
