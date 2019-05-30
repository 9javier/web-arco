import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleDetailHistoryComponent } from './title.component';

describe('TitleDetailHistoryComponent', () => {
  let component: TitleDetailHistoryComponent;
  let fixture: ComponentFixture<TitleDetailHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleDetailHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleDetailHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
