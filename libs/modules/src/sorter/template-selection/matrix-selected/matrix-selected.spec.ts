import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SorterMatrixSelectedComponent } from './matrix-selected';

describe('SorterMatrixSelectedComponent', () => {
  let component: SorterMatrixSelectedComponent;
  let fixture: ComponentFixture<SorterMatrixSelectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SorterMatrixSelectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SorterMatrixSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
