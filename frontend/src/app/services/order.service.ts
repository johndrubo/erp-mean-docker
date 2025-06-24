import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService, User } from './auth.service';
import { Product } from './product.service';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  customer: User;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: {
    product: string;
    quantity: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<Order>(this.apiUrl, orderData, { headers });
  }

  getMyOrders(): Observable<Order[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`, { headers });
  }

  getAllOrders(): Observable<Order[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Order[]>(this.apiUrl, { headers });
  }

  getOrder(id: string): Observable<Order> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Order>(`${this.apiUrl}/${id}`, { headers });
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    const headers = this.authService.getAuthHeaders();
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status }, { headers });
  }
}
