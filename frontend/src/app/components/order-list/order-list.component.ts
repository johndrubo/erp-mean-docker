import { Component, OnInit } from '@angular/core';
import { OrderService, Order, CreateOrderRequest } from '../../services/order.service';
import { ProductService, Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  products: Product[] = [];
  loading = false;
  showCreateForm = false;

  newOrder: CreateOrderRequest = {
    items: []
  };

  newOrderItem = {
    product: '',
    quantity: 1
  };

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadOrders();
    this.loadProducts();
  }

  loadOrders() {
    this.loading = true;
    const user = this.authService.currentUserSubject.value;
    
    // Admin and managers see all orders, employees see only their orders
    const ordersObservable = (user?.role === 'admin' || user?.role === 'manager') 
      ? this.orderService.getAllOrders()
      : this.orderService.getMyOrders();

    ordersObservable.subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.filter(p => p.stock > 0);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  addItemToOrder() {
    if (this.newOrderItem.product && this.newOrderItem.quantity > 0) {
      const existingItem = this.newOrder.items.find(item => item.product === this.newOrderItem.product);
      
      if (existingItem) {
        existingItem.quantity += this.newOrderItem.quantity;
      } else {
        this.newOrder.items.push({
          product: this.newOrderItem.product,
          quantity: this.newOrderItem.quantity
        });
      }
      
      this.newOrderItem = { product: '', quantity: 1 };
    }
  }

  removeItemFromOrder(index: number) {
    this.newOrder.items.splice(index, 1);
  }

  getProductName(productId: string): string {
    const product = this.products.find(p => p._id === productId);
    return product ? product.name : 'Unknown Product';
  }

  getProductPrice(productId: string): number {
    const product = this.products.find(p => p._id === productId);
    return product ? product.price : 0;
  }

  calculateOrderTotal(): number {
    return this.newOrder.items.reduce((total, item) => {
      return total + (this.getProductPrice(item.product) * item.quantity);
    }, 0);
  }

  createOrder() {
    if (this.newOrder.items.length > 0) {
      this.orderService.createOrder(this.newOrder).subscribe({
        next: (order) => {
          this.orders.unshift(order);
          this.resetOrderForm();
          this.showCreateForm = false;
          this.loadProducts(); // Refresh products to update stock
        },
        error: (error) => {
          console.error('Error creating order:', error);
          alert('Error creating order. Please check product availability.');
        }
      });
    }
  }

  updateOrderStatus(order: Order, newStatus: string) {
    this.orderService.updateOrderStatus(order._id, newStatus).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o._id === updatedOrder._id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Error updating order status. Please try again.');
      }
    });
  }

  resetOrderForm() {
    this.newOrder = { items: [] };
    this.newOrderItem = { product: '', quantity: 1 };
  }

  canManageOrders(): boolean {
    const user = this.authService.currentUserSubject.value;
    return user?.role === 'admin' || user?.role === 'manager';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }
}
