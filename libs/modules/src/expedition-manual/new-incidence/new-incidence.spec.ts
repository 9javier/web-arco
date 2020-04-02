import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIncidenceComponent } from './new-incidence.component';

describe('ProductsAvelonComponent', () => {
  let component: NewIncidenceComponent;
  let fixture: ComponentFixture<NewIncidenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewIncidenceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIncidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
