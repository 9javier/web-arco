import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoExpeditionsComponent } from './info-expeditions.component';

describe('InfoExpeditionsComponent', () => {
  let component: InfoExpeditionsComponent;
  let fixture: ComponentFixture<InfoExpeditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoExpeditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoExpeditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
