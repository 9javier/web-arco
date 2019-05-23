import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleListWorkwavesComponent } from './list-title.component';

describe('TitleListWorkwavesComponent', () => {
  let component: TitleListWorkwavesComponent;
  let fixture: ComponentFixture<TitleListWorkwavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleListWorkwavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleListWorkwavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
