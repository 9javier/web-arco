import { TestBed } from '@angular/core/testing';

import { TemplateZonesService } from './template-zones.service';

describe('TemplateZonesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TemplateZonesService = TestBed.get(TemplateZonesService);
    expect(service).toBeTruthy();
  });
});
