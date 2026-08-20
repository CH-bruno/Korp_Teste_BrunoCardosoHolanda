import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProdutoService } from '../../core/services/produto';
import { NotaFiscalService } from '../../core/services/nota-fiscal';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-nota-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './nota-form.html',
  styleUrl: './nota-form.scss'
})
export class NotaForm implements OnInit {
  produtos: Produto[] = [];
  itemForm: FormGroup;
  itensAdicionados: { produtoId: number; quantidade: number }[] = [];
  colunasExibidas = ['produto', 'quantidade', 'acoes'];
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private notaFiscalService: NotaFiscalService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.itemForm = this.fb.group({
      produtoId: [null, Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Erro ao carregar produtos.', 'Fechar', { duration: 4000, panelClass: ['snackbar-erro'] });
        this.cdr.detectChanges();
      }
    });
  }

  nomeProduto(produtoId: number): string {
    const produto = this.produtos.find(p => p.id === produtoId);
    return produto ? `${produto.codigo} - ${produto.descricao}` : '';
  }

  adicionarItem(): void {
    if (this.itemForm.invalid) return;

    const { produtoId, quantidade } = this.itemForm.value;

    const existente = this.itensAdicionados.find(i => i.produtoId === produtoId);
    if (existente) {
      existente.quantidade += quantidade;
    } else {
      this.itensAdicionados.push({ produtoId, quantidade });
    }

    this.itemForm.reset({ produtoId: null, quantidade: 1 });
  }

  removerItem(produtoId: number): void {
    this.itensAdicionados = this.itensAdicionados.filter(i => i.produtoId !== produtoId);
  }

  salvar(): void {
    if (this.itensAdicionados.length === 0) {
      this.snackBar.open('Adicione ao menos um produto à nota.', 'Fechar', { duration: 4000, panelClass: ['snackbar-erro'] });
      return;
    }

    this.salvando = true;
    this.notaFiscalService.criar({ itens: this.itensAdicionados }).subscribe({
      next: (nota) => {
        this.snackBar.open('Nota criada com sucesso.', 'Fechar', { duration: 3000, panelClass: ['snackbar-sucesso'] });
        this.router.navigate(['/notas', nota.id]);
      },
      error: () => {
        this.salvando = false;
        this.snackBar.open('Erro ao criar nota.', 'Fechar', { duration: 4000, panelClass: ['snackbar-erro'] });
        this.cdr.detectChanges();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/notas']);
  }
}