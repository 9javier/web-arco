import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentilationNoSorterComponent } from './ventilation-no-sorter.component';

describe('VentilationNoSorterComponent', () => {
  let component: VentilationNoSorterComponent;
  let fixture: ComponentFixture<VentilationNoSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VentilationNoSorterComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentilationNoSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
