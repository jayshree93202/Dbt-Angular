import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressRelease } from './press-release';

describe('PressRelease', () => {
  let component: PressRelease;
  let fixture: ComponentFixture<PressRelease>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PressRelease],
    }).compileComponents();

    fixture = TestBed.createComponent(PressRelease);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
