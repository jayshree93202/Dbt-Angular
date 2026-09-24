import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadmLayout } from './sadm-layout';

describe('SadmLayout', () => {
  let component: SadmLayout;
  let fixture: ComponentFixture<SadmLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SadmLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(SadmLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
