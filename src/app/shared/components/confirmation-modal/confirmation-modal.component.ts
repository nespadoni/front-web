import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';
import {animate, group, keyframes, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {ModalConfig, ModalService} from '../../../core/services/modal.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  animations: [
    // 🌟 ANIMAÇÃO MELHORADA DO OVERLAY
    trigger('overlayAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          backdropFilter: 'blur(0px)'
        }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({
          opacity: 1,
          backdropFilter: 'blur(4px)'
        }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({
          opacity: 0,
          backdropFilter: 'blur(0px)'
        }))
      ])
    ]),

    // 🎪 ANIMAÇÃO ESPETACULAR DO MODAL
    trigger('modalAnimation', [
      transition(':enter', [
        style({
          transform: 'scale(0.3) rotateX(-30deg)',
          opacity: 0
        }),
        group([
          animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            style({
              transform: 'scale(1) rotateX(0deg)',
              opacity: 1
            })
          ),
          // Animação dos filhos com stagger
          query('.modal-content > *', [
            style({
              transform: 'translateY(30px)',
              opacity: 0
            }),
            stagger(50, [
              animate('300ms ease-out',
                style({
                  transform: 'translateY(0)',
                  opacity: 1
                })
              )
            ])
          ], {optional: true})
        ])
      ]),
      transition(':leave', [
        group([
          animate('250ms cubic-bezier(0.4, 0, 1, 1)',
            style({
              transform: 'scale(0.8) rotateX(10deg)',
              opacity: 0
            })
          ),
          query('.modal-content > *', [
            stagger(30, [
              animate('200ms ease-in',
                style({
                  transform: 'translateY(-20px)',
                  opacity: 0
                })
              )
            ])
          ], {optional: true})
        ])
      ])
    ]),

    // 🎯 ANIMAÇÃO DOS BOTÕES
    trigger('buttonHover', [
      state('normal', style({transform: 'scale(1)'})),
      state('hover', style({transform: 'scale(1.05)'})),
      transition('normal <=> hover', animate('150ms ease-out'))
    ]),

    // ⭐ ANIMAÇÃO DO ÍCONE DE FECHAR
    trigger('closeIconAnimation', [
      transition(':enter', [
        animate('400ms 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          keyframes([
            style({transform: 'rotate(-180deg) scale(0)', opacity: 0, offset: 0}),
            style({transform: 'rotate(-90deg) scale(0.5)', opacity: 0.5, offset: 0.5}),
            style({transform: 'rotate(0deg) scale(1)', opacity: 1, offset: 1})
          ])
        )
      ])
    ])
  ]
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  config: ModalConfig | null = null;
  // Estados para animações de hover
  confirmButtonState = 'normal';
  cancelButtonState = 'normal';
  private destroy$ = new Subject<void>();

  constructor(private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.modalService.isOpen
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => this.isOpen = isOpen);

    this.modalService.config
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => this.config = config);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onConfirm(): void {
    this.modalService.confirm();
  }

  onCancel(): void {
    this.modalService.closeModal();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.modalService.closeModal();
    }
  }

  // Métodos para controle de hover dos botões
  onConfirmHover(state: boolean): void {
    this.confirmButtonState = state ? 'hover' : 'normal';
  }

  onCancelHover(state: boolean): void {
    this.cancelButtonState = state ? 'hover' : 'normal';
  }
}
