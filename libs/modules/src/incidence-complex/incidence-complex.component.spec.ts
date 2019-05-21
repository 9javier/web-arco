import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenceComplexComponent } from "./incidence-complex.component";

describe('IncidenceComplexComponent', () => {
  let component: IncidenceComplexComponent;
  let fixture: ComponentFixture<IncidenceComplexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidenceComplexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenceComplexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
