import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  error = '';

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.loading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load customers';
        this.loading = false;
      }
    });
  }

  deleteCustomer(id: string) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        this.fetchCustomers();
      });
    }
  }
}
