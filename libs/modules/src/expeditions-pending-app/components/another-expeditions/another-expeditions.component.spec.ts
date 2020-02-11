import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherExpeditionsComponent } from './another-expeditions.component';

describe('ExpeditionInfoComponent', () => {
  let component: AnotherExpeditionsComponent;
  let fixture: ComponentFixture<AnotherExpeditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnotherExpeditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnotherExpeditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
