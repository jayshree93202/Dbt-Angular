import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastUpdateSchemeList } from './last-update-scheme-list';

describe('LastUpdateSchemeList', () => {
  let component: LastUpdateSchemeList;
  let fixture: ComponentFixture<LastUpdateSchemeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastUpdateSchemeList],
    }).compileComponents();

    fixture = TestBed.createComponent(LastUpdateSchemeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
