import { TestBed } from '@angular/core/testing';

import { SorterTemplateService } from './sorter-template.service';

describe('SorterTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SorterTemplateService = TestBed.get(SorterTemplateService);
    expect(service).toBeTruthy();
  });
});
