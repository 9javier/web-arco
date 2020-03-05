import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectHandlerComponent } from './defect-handler.component';

describe('DefectHandlerComponent', () => {
  let component: DefectHandlerComponent;
  let fixture: ComponentFixture<DefectHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
