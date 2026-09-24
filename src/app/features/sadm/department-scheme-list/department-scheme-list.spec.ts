import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentSchemeList } from './department-scheme-list';

describe('DepartmentSchemeList', () => {
  let component: DepartmentSchemeList;
  let fixture: ComponentFixture<DepartmentSchemeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentSchemeList],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentSchemeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
