import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionInfoComponent } from './expedition-info.component';

describe('ExpeditionInfoComponent', () => {
  let component: ExpeditionInfoComponent;
  let fixture: ComponentFixture<ExpeditionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpeditionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpeditionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
