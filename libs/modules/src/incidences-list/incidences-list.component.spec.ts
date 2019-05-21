import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidencesListComponent } from './incidences-list.component';

describe('IncidencesListComponent', () => {
  let component: IncidencesListComponent;
  let fixture: ComponentFixture<IncidencesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidencesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidencesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
