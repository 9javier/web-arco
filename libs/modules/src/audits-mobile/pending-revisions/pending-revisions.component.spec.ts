import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRevisionsComponent } from './pending-revisions.component';

describe('PendingRevisionsComponent', () => {
  let component: PendingRevisionsComponent;
  let fixture: ComponentFixture<PendingRevisionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingRevisionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRevisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
