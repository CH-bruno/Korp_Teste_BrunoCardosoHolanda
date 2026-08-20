import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaFiscal, CriarNotaRequest } from '../../models/nota-fiscal.model';

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService {
  private readonly apiUrl = 'http://localhost:5230/api/notas';

  constructor(private http: HttpClient) {}

  listar(): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<NotaFiscal> {
    return this.http.get<NotaFiscal>(`${this.apiUrl}/${id}`);
  }

  criar(request: CriarNotaRequest): Observable<NotaFiscal> {
    return this.http.post<NotaFiscal>(this.apiUrl, request);
  }

  imprimir(id: number): Observable<NotaFiscal> {
    return this.http.post<NotaFiscal>(`${this.apiUrl}/${id}/imprimir`, {});
  }
}