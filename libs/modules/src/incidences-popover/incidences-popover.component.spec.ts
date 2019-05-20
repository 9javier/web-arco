import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidencesPopoverComponent } from "./incidences-popover.component";

describe('IncidencesPopoverComponent', () => {
  let component: IncidencesPopoverComponent;
  let fixture: ComponentFixture<IncidencesPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidencesPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidencesPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
