import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface ModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isModalOpen$ = new BehaviorSubject<boolean>(false);
  private modalConfig$ = new BehaviorSubject<ModalConfig | null>(null);
  private confirmCallback?: () => void;

  get isOpen() {
    return this.isModalOpen$.asObservable();
  }

  get config() {
    return this.modalConfig$.asObservable();
  }

  openConfirmationModal(config: ModalConfig, onConfirm: () => void): void {
    this.modalConfig$.next(config);
    this.confirmCallback = onConfirm;
    this.isModalOpen$.next(true);
  }

  confirm(): void {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.closeModal();
  }

  closeModal(): void {
    this.isModalOpen$.next(false);
    this.modalConfig$.next(null);
    this.confirmCallback = undefined;
  }
}
