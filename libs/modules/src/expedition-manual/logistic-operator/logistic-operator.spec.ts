import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionManualComponent } from './logistic-operator.component';

describe('ProductsAvelonComponent', () => {
  let component: ExpeditionManualComponent;
  let fixture: ComponentFixture<ExpeditionManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpeditionManualComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpeditionManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
