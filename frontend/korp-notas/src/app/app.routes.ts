import { Routes } from '@angular/router';
import { ProdutoList } from './produtos/produto-list/produto-list';
import { ProdutoForm } from './produtos/produto-form/produto-form';
import { NotaList } from './notas/nota-list/nota-list';
import { NotaForm } from './notas/nota-form/nota-form';
import { NotaDetalhe } from './notas/nota-detalhe/nota-detalhe';

export const routes: Routes = [
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: 'produtos', component: ProdutoList },
  { path: 'produtos/novo', component: ProdutoForm },
  { path: 'produtos/:id/editar', component: ProdutoForm },
  { path: 'notas', component: NotaList },
  { path: 'notas/nova', component: NotaForm },
  { path: 'notas/:id', component: NotaDetalhe }
];