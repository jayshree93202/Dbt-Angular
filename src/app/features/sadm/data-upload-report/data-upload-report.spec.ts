import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataUploadReport } from './data-upload-report';

describe('DataUploadReport', () => {
  let component: DataUploadReport;
  let fixture: ComponentFixture<DataUploadReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataUploadReport],
    }).compileComponents();

    fixture = TestBed.createComponent(DataUploadReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
