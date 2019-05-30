import { TestBed } from '@angular/core/testing';

import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const pipe: ReversePipe = TestBed.get(ReversePipe);
    expect(pipe).toBeTruthy();
  });
});
