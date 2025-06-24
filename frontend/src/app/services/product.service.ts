import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProducts(): Observable<Product[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Product[]>(this.apiUrl, { headers });
  }

  getProduct(id: string): Observable<Product> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Product>(`${this.apiUrl}/${id}`, { headers });
  }

  createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<Product>(this.apiUrl, product, { headers });
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers });
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers });
  }
}
