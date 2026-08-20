import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotaFiscalService } from '../../core/services/nota-fiscal';
import { NotaFiscal } from '../../models/nota-fiscal.model';

@Component({
  selector: 'app-nota-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './nota-list.html',
  styleUrl: './nota-list.scss'
})
export class NotaList implements OnInit {
  notas: NotaFiscal[] = [];
  carregando = true;
  colunasExibidas = ['numero', 'status', 'dataCriacao', 'itens', 'acoes'];

  constructor(
    private notaFiscalService: NotaFiscalService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarNotas();
  }

  carregarNotas(): void {
    this.carregando = true;
    this.notaFiscalService.listar().subscribe({
      next: (notas) => {
        this.notas = notas;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Erro ao carregar notas.', 'Fechar', { duration: 4000 });
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}