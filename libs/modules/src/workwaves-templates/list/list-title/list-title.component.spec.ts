import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleListWorkwavesTemplateComponent } from './list-title.component';

describe('TitleListWorkwavesTemplateComponent', () => {
  let component: TitleListWorkwavesTemplateComponent;
  let fixture: ComponentFixture<TitleListWorkwavesTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleListWorkwavesTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleListWorkwavesTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
