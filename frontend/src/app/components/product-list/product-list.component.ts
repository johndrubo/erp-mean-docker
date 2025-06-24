import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  showAddForm = false;
  editingProduct: Product | null = null;

  newProduct = {
    name: '',
    sku: '',
    description: '',
    price: 0,
    stock: 0
  };

  constructor(
    private productService: ProductService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  addProduct() {
    if (this.newProduct.name && this.newProduct.sku && this.newProduct.price >= 0) {
      this.productService.createProduct(this.newProduct).subscribe({
        next: (product) => {
          this.products.unshift(product);
          this.resetForm();
          this.showAddForm = false;
        },
        error: (error) => {
          console.error('Error adding product:', error);
          alert('Error adding product. Please try again.');
        }
      });
    }
  }

  editProduct(product: Product) {
    this.editingProduct = { ...product };
  }

  updateProduct() {
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct._id, this.editingProduct).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p._id === updatedProduct._id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          this.editingProduct = null;
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert('Error updating product. Please try again.');
        }
      });
    }
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.productService.deleteProduct(product._id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== product._id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Error deleting product. Please try again.');
        }
      });
    }
  }

  resetForm() {
    this.newProduct = {
      name: '',
      sku: '',
      description: '',
      price: 0,
      stock: 0
    };
  }

  cancelEdit() {
    this.editingProduct = null;
  }

  canModifyProducts(): boolean {
    const user = this.authService.currentUserSubject.value;
    return user?.role === 'admin' || user?.role === 'manager';
  }
}
