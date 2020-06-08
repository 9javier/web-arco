import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorLanguageComponent } from './paginator-language.component';

describe('PaginatorLanguageComponent', () => {
  let component: PaginatorLanguageComponent;
  let fixture: ComponentFixture<PaginatorLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginatorLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
