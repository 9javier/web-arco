import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleListWorkwavesHistoryComponent } from './list-title.component';

describe('TitleListWorkwavesHistoryComponent', () => {
  let component: TitleListWorkwavesHistoryComponent;
  let fixture: ComponentFixture<TitleListWorkwavesHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleListWorkwavesHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleListWorkwavesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
