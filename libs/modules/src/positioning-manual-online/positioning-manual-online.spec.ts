import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositioningManualOnlineComponent } from './positioning-manual-online.component';

describe('PositioningManualComponent', () => {
  let component: PositioningManualOnlineComponent;
  let fixture: ComponentFixture<PositioningManualOnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PositioningManualOnlineComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositioningManualOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
