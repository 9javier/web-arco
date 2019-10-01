import { TestBed } from '@angular/core/testing';

import { TemplateColorsService } from './template-colors.service';

describe('TemplateColorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TemplateColorsService = TestBed.get(TemplateColorsService);
    expect(service).toBeTruthy();
  });
});
