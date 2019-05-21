import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenceSimpleComponent } from "./incidence-simple.component";

describe('IncidenceSimpleComponent', () => {
  let component: IncidenceSimpleComponent;
  let fixture: ComponentFixture<IncidenceSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidenceSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenceSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
