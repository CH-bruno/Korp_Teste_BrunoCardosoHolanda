import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotaFiscalService } from '../../core/services/nota-fiscal';
import { ProdutoService } from '../../core/services/produto';
import { NotaFiscal } from '../../models/nota-fiscal.model';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-nota-detalhe',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './nota-detalhe.html',
  styleUrl: './nota-detalhe.scss'
})
export class NotaDetalhe implements OnInit {
  nota: NotaFiscal | null = null;
  produtosMap = new Map<number, Produto>();
  carregando = true;
  imprimindo = false;
  erroImpressao: string | null = null;
  colunasExibidas = ['produto', 'quantidade'];

  constructor(
    private notaFiscalService: NotaFiscalService,
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarNota(id);
  }

  carregarNota(id: number): void {
    this.carregando = true;
    this.notaFiscalService.buscarPorId(id).subscribe({
      next: (nota) => {
        this.nota = nota;
        this.carregarProdutos();
      },
      error: () => {
        this.snackBar.open('Erro ao carregar nota.', 'Fechar', { duration: 4000, panelClass: ['snackbar-erro'] });
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  carregarProdutos(): void {
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        produtos.forEach(p => this.produtosMap.set(p.id, p));
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  nomeProduto(produtoId: number): string {
    const produto = this.produtosMap.get(produtoId);
    return produto ? `${produto.codigo} - ${produto.descricao}` : `Produto #${produtoId}`;
  }

  imprimir(): void {
    if (!this.nota) return;

    this.imprimindo = true;
    this.erroImpressao = null;
    this.cdr.detectChanges();

    this.notaFiscalService.imprimir(this.nota.id).subscribe({
      next: (notaAtualizada) => {
        this.nota = notaAtualizada;
        this.imprimindo = false;
        this.snackBar.open('Nota impressa com sucesso!', 'Fechar', { duration: 3000, panelClass: ['snackbar-sucesso'] });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.imprimindo = false;
        this.erroImpressao = err?.error?.erro || 'Não foi possível processar a nota. Tente novamente.';
        this.cdr.detectChanges();
      }
    });
  }
}