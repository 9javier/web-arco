import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialFieldsComponent } from './commercial-fields.component';

describe('CommercialFieldsComponent', () => {
  let component: CommercialFieldsComponent;
  let fixture: ComponentFixture<CommercialFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommercialFieldsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
