import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticsOperators } from './logistics-operators.component';

describe('LogisticsOperators', () => {
  let component: LogisticsOperators;
  let fixture: ComponentFixture<LogisticsOperators>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogisticsOperators ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticsOperators);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
