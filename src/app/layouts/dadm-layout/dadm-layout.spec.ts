import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadmLayout } from './dadm-layout';

describe('DadmLayout', () => {
  let component: DadmLayout;
  let fixture: ComponentFixture<DadmLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadmLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(DadmLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
