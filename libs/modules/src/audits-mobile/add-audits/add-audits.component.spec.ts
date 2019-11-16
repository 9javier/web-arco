import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuditsComponent } from './add-audits.component';

describe('AddAuditsComponent', () => {
  let component: AddAuditsComponent;
  let fixture: ComponentFixture<AddAuditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAuditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAuditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
