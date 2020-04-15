import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionCollectedComponent } from './expedition-collected.component';

describe('ProductsAvelonComponent', () => {
  let component: ExpeditionCollectedComponent;
  let fixture: ComponentFixture<ExpeditionCollectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpeditionCollectedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpeditionCollectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
