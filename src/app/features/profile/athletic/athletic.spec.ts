import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Athletic } from './athletic';

describe('Athletic', () => {
  let component: Athletic;
  let fixture: ComponentFixture<Athletic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Athletic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Athletic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
