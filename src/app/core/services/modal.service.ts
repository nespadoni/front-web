import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface ModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen = this.isOpenSubject.asObservable();
  private configSubject = new BehaviorSubject<ModalConfig | null>(null);
  config = this.configSubject.asObservable();
  private onConfirmCallback: (() => void) | null = null;

  openConfirmationModal(config: ModalConfig, onConfirm: () => void): void {
    this.configSubject.next(config);
    this.onConfirmCallback = onConfirm;
    this.isOpenSubject.next(true);
  }

  confirm(): void {
    if (this.onConfirmCallback) {
      this.onConfirmCallback();
    }
    this.closeModal();
  }

  closeModal(): void {
    this.isOpenSubject.next(false);
    this.configSubject.next(null);
    this.onConfirmCallback = null;
  }
}
