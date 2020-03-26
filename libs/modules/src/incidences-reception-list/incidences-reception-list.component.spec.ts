import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidencesReceptionListComponent } from './incidences-reception-list.component';

describe('IncidencesReceptionListComponent', () => {
  let component: IncidencesReceptionListComponent;
  let fixture: ComponentFixture<IncidencesReceptionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidencesReceptionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidencesReceptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
