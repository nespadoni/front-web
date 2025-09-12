import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'app-photo-upload-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-upload-modal.html',
  styleUrl: './photo-upload-modal.scss'
})
export class PhotoUploadModal {
  @Input() isVisible = false;
  @Input() isProcessing = false; // Controlado pelo componente pai
  @Output() photoSelected = new EventEmitter<File>(); // Emite o arquivo selecionado
  @Output() modalClosed = new EventEmitter<void>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isDragOver = false;
  errorMessage = '';

  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  constructor() {
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.handleFile(files[0]);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.errorMessage = '';
  }

  onSave(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Por favor, selecione uma foto para continuar.';
      return;
    }
    this.photoSelected.emit(this.selectedFile);
    // Não fechamos o modal aqui, o componente pai o fará
  }

  onClose(): void {
    if (this.isProcessing) return; // Não permite fechar durante o registro

    this.selectedFile = null;
    this.previewUrl = null;
    this.errorMessage = '';
    this.modalClosed.emit();
  }

  private handleFile(file: File): void {
    this.errorMessage = '';

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Por favor, selecione apenas arquivos de imagem.';
      return;
    }

    if (file.size > this.MAX_FILE_SIZE) {
      this.errorMessage = 'O arquivo deve ter no máximo 5MB.';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}
