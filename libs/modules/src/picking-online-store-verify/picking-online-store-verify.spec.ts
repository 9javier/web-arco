import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickingOnlineStoreVerifyComponent } from './picking-online-store-verify.component';

describe('PickingOnlineStoreVerifyComponent', () => {
  let component: PickingOnlineStoreVerifyComponent;
  let fixture: ComponentFixture<PickingOnlineStoreVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PickingOnlineStoreVerifyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingOnlineStoreVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
