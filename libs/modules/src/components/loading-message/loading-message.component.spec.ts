import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingMessageComponent } from './loading-message.component';

describe('LoadingMessageComponent', () => {
  let component: LoadingMessageComponent;
  let fixture: ComponentFixture<LoadingMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
