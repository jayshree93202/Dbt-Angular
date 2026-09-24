import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveDisapproveDepartment } from './approve-disapprove-department';

describe('ApproveDisapproveDepartment', () => {
  let component: ApproveDisapproveDepartment;
  let fixture: ComponentFixture<ApproveDisapproveDepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveDisapproveDepartment],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveDisapproveDepartment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
