import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateExpeditionAvelonComponent } from './state-expedition-avelon.component';

describe('StateExpeditionAvelonComponent', () => {
  let component: StateExpeditionAvelonComponent;
  let fixture: ComponentFixture<StateExpeditionAvelonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateExpeditionAvelonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateExpeditionAvelonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
