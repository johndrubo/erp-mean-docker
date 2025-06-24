import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="nav-brand">
          <h1>ERP Management System</h1>
        </div>
        <div class="nav-menu">
          <span *ngIf="currentUser" class="user-info">
            Welcome, {{ currentUser.name }} ({{ currentUser.role }})
          </span>
          <button *ngIf="!currentUser" (click)="showLoginForm = !showLoginForm" class="btn btn-primary">
            {{ showLoginForm ? 'Cancel' : 'Login' }}
          </button>
          <button *ngIf="currentUser" (click)="logout()" class="btn btn-secondary">
            Logout
          </button>
        </div>
      </nav>

      <div class="main-content">
        <!-- Login Form -->
        <div *ngIf="!currentUser && showLoginForm" class="login-form">
          <h2>Login</h2>
          <form (ngSubmit)="login()" #loginForm="ngForm">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" [(ngModel)]="loginData.email" name="email" required class="form-control">
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" [(ngModel)]="loginData.password" name="password" required class="form-control">
            </div>
            <button type="submit" [disabled]="!loginForm.valid" class="btn btn-primary">Login</button>
          </form>
          <p class="register-hint">Don't have an account? <a href="#" (click)="showRegisterForm = true; showLoginForm = false">Register here</a></p>
        </div>

        <!-- Register Form -->
        <div *ngIf="!currentUser && showRegisterForm" class="register-form">
          <h2>Register</h2>
          <form (ngSubmit)="register()" #registerForm="ngForm">
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" [(ngModel)]="registerData.name" name="name" required class="form-control">
            </div>
            <div class="form-group">
              <label for="regEmail">Email:</label>
              <input type="email" id="regEmail" [(ngModel)]="registerData.email" name="email" required class="form-control">
            </div>
            <div class="form-group">
              <label for="regPassword">Password:</label>
              <input type="password" id="regPassword" [(ngModel)]="registerData.password" name="password" required class="form-control">
            </div>
            <div class="form-group">
              <label for="role">Role:</label>
              <select id="role" [(ngModel)]="registerData.role" name="role" class="form-control">
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" [disabled]="!registerForm.valid" class="btn btn-primary">Register</button>
            <button type="button" (click)="showRegisterForm = false; showLoginForm = true" class="btn btn-secondary">Back to Login</button>
          </form>
        </div>

        <!-- Dashboard -->
        <div *ngIf="currentUser" class="dashboard">
          <div class="dashboard-tabs">
            <button (click)="activeTab = 'products'" [class.active]="activeTab === 'products'" class="tab-button">
              Products
            </button>
            <button (click)="activeTab = 'orders'" [class.active]="activeTab === 'orders'" class="tab-button">
              Orders
            </button>
            <button (click)="activeTab = 'customers'" [class.active]="activeTab === 'customers'" class="tab-button">
              Customers
            </button>
          </div>

          <div class="tab-content">
            <app-product-list *ngIf="activeTab === 'products'"></app-product-list>
            <app-order-list *ngIf="activeTab === 'orders'"></app-order-list>
            <app-customer-list *ngIf="activeTab === 'customers'"></app-customer-list>
          </div>
        </div>

        <!-- Welcome Message -->
        <div *ngIf="!currentUser && !showLoginForm && !showRegisterForm" class="welcome">
          <h2>Welcome to ERP Management System</h2>
          <p>Please login to access the system features.</p>
          <button (click)="showLoginForm = true" class="btn btn-primary btn-large">Get Started</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .navbar {
      background-color: #2c3e50;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-brand h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      font-size: 0.9rem;
    }

    .main-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .login-form, .register-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      max-width: 400px;
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      text-decoration: none;
      display: inline-block;
      margin-right: 0.5rem;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }

    .btn-large {
      padding: 1rem 2rem;
      font-size: 1.2rem;
    }

    .btn:hover {
      opacity: 0.9;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .dashboard-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .tab-button {
      padding: 0.75rem 1.5rem;
      border: none;
      background-color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tab-button.active {
      background-color: #3498db;
      color: white;
    }

    .welcome {
      text-align: center;
      background: white;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .register-hint {
      text-align: center;
      margin-top: 1rem;
    }

    .register-hint a {
      color: #3498db;
      text-decoration: none;
    }
  `]
})
export class AppComponent implements OnInit {
  showLoginForm = false;
  showRegisterForm = false;
  activeTab = 'products';
  currentUser: User | null = null;

  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    name: '',
    email: '',
    password: '',
    role: 'employee'
  };

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Subscribe to current user changes
    this.authService.currentUser.subscribe((user: User | null) => {
      this.currentUser = user;
    });
    
    // Check if user is already logged in
    this.authService.getCurrentUser().subscribe();
  }

  async login() {
    try {
      await this.authService.login(this.loginData.email, this.loginData.password);
      this.showLoginForm = false;
      this.loginData = { email: '', password: '' };
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  }

  async register() {
    try {
      await this.authService.register(this.registerData);
      this.showRegisterForm = false;
      this.registerData = { name: '', email: '', password: '', role: 'employee' };
      alert('Registration successful! You are now logged in.');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  }

  logout() {
    this.authService.logout();
    this.activeTab = 'products';
  }
}
