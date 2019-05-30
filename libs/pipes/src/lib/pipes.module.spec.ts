import { async, TestBed } from '@angular/core/testing';
import { PipesModule } from './pipes.module';

describe('PipesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PipesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PipesModule).toBeDefined();
  });
});
