import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixOutputSorterComponent } from './matrix-output.component';

describe('MatrixOutputSorterComponent', () => {
  let component: MatrixOutputSorterComponent;
  let fixture: ComponentFixture<MatrixOutputSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixOutputSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixOutputSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
