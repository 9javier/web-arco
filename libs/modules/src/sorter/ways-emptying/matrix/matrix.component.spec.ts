import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixEmptyingSorterComponent } from './matrix.component';

describe('MatrixEmptyingSorterComponent', () => {
  let component: MatrixEmptyingSorterComponent;
  let fixture: ComponentFixture<MatrixEmptyingSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixEmptyingSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixEmptyingSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
