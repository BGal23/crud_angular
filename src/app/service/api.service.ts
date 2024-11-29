import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TListItem } from '../types/TListItem';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private URL = 'https://67487cd15801f51535911fa2.mockapi.io';
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<TListItem[]>(`${this.URL}/campaigns`);
  }

  delete(taskId: number) {
    return this.http.delete(`${this.URL}/campaigns/${taskId}`);
  }

  update(taskId: number, payload: boolean) {
    return this.http.patch<TListItem>(
      `${this.URL}/campaigns/${taskId}`,
      payload
    );
  }

  add(obj: TListItem) {
    return this.http.post<TListItem>(`${this.URL}/campaigns`, obj);
  }
}
