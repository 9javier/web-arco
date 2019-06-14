import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositioningManualComponent } from './positioning-manual.component';

describe('PositioningManualComponent', () => {
  let component: PositioningManualComponent;
  let fixture: ComponentFixture<PositioningManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PositioningManualComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositioningManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
