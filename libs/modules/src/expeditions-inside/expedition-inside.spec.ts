import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionInsideComponent } from './expedition-inside.component';

describe('ProductsAvelonComponent', () => {
  let component: ExpeditionInsideComponent;
  let fixture: ComponentFixture<ExpeditionInsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpeditionInsideComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpeditionInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
