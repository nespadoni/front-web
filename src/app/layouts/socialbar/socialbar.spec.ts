import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Socialbar } from './socialbar';

describe('Socialbar', () => {
  let component: Socialbar;
  let fixture: ComponentFixture<Socialbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Socialbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Socialbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
