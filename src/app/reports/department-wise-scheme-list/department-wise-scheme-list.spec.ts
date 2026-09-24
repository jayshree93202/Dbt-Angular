import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentWiseSchemeList } from './department-wise-scheme-list';

describe('DepartmentWiseSchemeList', () => {
  let component: DepartmentWiseSchemeList;
  let fixture: ComponentFixture<DepartmentWiseSchemeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentWiseSchemeList],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentWiseSchemeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
