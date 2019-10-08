import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixSelectWaySorterComponent } from './matrix-select-way-sorter.component';

describe('MatrixSelectWaySorterComponent', () => {
  let component: MatrixSelectWaySorterComponent;
  let fixture: ComponentFixture<MatrixSelectWaySorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixSelectWaySorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixSelectWaySorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
