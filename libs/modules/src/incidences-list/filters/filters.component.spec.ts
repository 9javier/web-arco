import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersIncidencesComponent } from './filters.component';

describe('FiltersIncidencesComponent', () => {
  let component: FiltersIncidencesComponent;
  let fixture: ComponentFixture<FiltersIncidencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersIncidencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersIncidencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
