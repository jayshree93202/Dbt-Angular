import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentCSSANDStateSchemeList } from './department-cssandstate-scheme-list';

describe('DepartmentCSSANDStateSchemeList', () => {
  let component: DepartmentCSSANDStateSchemeList;
  let fixture: ComponentFixture<DepartmentCSSANDStateSchemeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentCSSANDStateSchemeList],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentCSSANDStateSchemeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
