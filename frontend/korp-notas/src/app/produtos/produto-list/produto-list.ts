import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProdutoService } from '../../core/services/produto';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.scss'
})
export class ProdutoList implements OnInit {
  produtos: Produto[] = [];
  carregando = true;
  colunasExibidas = ['codigo', 'descricao', 'saldo', 'acoes'];

  constructor(
    private produtoService: ProdutoService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Erro ao carregar produtos.', 'Fechar', { duration: 4000, panelClass: ['snackbar-erro'] });
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  excluir(id: number): void {
    if (!confirm('Deseja realmente excluir este produto?')) return;

    this.produtoService.excluir(id).subscribe({
      next: () => {
        this.snackBar.open('Produto excluído.', 'Fechar', { duration: 3000, panelClass: ['snackbar-sucesso'] });
        this.carregarProdutos();
      },
      error: () => {
        this.snackBar.open('Erro ao excluir produto.', 'Fechar', { duration: 4000, panelClass: ['snackbar-erro'] });
      }
    });
  }
}