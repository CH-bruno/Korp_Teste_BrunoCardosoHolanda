import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProdutoService } from '../../core/services/produto';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.scss'
})
export class ProdutoForm implements OnInit {
  form: FormGroup;
  editando = false;
  produtoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      saldo: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editando = true;
      this.produtoId = Number(idParam);
      this.carregarProduto(this.produtoId);
    }
  }

  carregarProduto(id: number): void {
    this.produtoService.buscarPorId(id).subscribe({
      next: (produto) => this.form.patchValue(produto),
      error: () => this.snackBar.open('Erro ao carregar produto.', 'Fechar', { duration: 4000, panelClass: ['snackbar-erro'] })
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    if (this.editando && this.produtoId) {
      const produtoAtualizado = { id: this.produtoId, ...this.form.value };
      this.produtoService.atualizar(this.produtoId, produtoAtualizado).subscribe({
        next: () => {
          this.snackBar.open('Produto atualizado.', 'Fechar', { duration: 3000, panelClass: ['snackbar-sucesso'] });
          this.router.navigate(['/produtos']);
        },
        error: () => this.snackBar.open('Erro ao atualizar produto.', 'Fechar', { duration: 4000, panelClass: ['snackbar-erro'] })
      });
    } else {
      this.produtoService.criar(this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Produto criado.', 'Fechar', { duration: 3000, panelClass: ['snackbar-sucesso'] });
          this.router.navigate(['/produtos']);
        },
        error: () => this.snackBar.open('Erro ao criar produto.', 'Fechar', { duration: 4000, panelClass: ['snackbar-erro'] })
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/produtos']);
  }
}