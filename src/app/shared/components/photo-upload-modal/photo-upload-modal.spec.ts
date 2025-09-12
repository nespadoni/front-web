import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PhotoUploadModal} from './photo-upload-modal';

describe('PhotoUploadModal', () => {
  let component: PhotoUploadModal;
  let fixture: ComponentFixture<PhotoUploadModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoUploadModal]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PhotoUploadModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
