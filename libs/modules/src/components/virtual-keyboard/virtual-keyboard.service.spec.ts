import { TestBed } from '@angular/core/testing';

import { VirtualKeyboardService } from './virtual-keyboard.service';

describe('VirtualKeyboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VirtualKeyboardService = TestBed.get(VirtualKeyboardService);
    expect(service).toBeTruthy();
  });
});
