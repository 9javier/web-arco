import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidencesButtonComponent } from "./incidences-button.component";

describe('IncidencesButtonComponent', () => {
  let component: IncidencesButtonComponent;
  let fixture: ComponentFixture<IncidencesButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidencesButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidencesButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
