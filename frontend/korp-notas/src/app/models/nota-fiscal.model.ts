export interface ItemNotaFiscal {
  id?: number;
  produtoId: number;
  quantidade: number;
}

export interface NotaFiscal {
  id: number;
  numero: number;
  status: 'Aberta' | 'Fechada';
  dataCriacao: string;
  itens: ItemNotaFiscal[];
}

export interface CriarNotaRequest {
  itens: { produtoId: number; quantidade: number }[];
}