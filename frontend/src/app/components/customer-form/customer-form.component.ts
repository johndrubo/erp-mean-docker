import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService, Customer } from '../../services/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEdit = false;
  customerId: string | null = null;
  error = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      company: ['']
    });
  }

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.isEdit = true;
      this.customerService.getCustomer(this.customerId).subscribe({
        next: (customer) => this.customerForm.patchValue(customer),
        error: () => this.error = 'Failed to load customer'
      });
    }
  }

  onSubmit() {
    if (this.customerForm.invalid) return;
    const customer: Customer = this.customerForm.value;
    if (this.isEdit && this.customerId) {
      this.customerService.updateCustomer(this.customerId, customer).subscribe({
        next: () => this.router.navigate(['/customers']),
        error: () => this.error = 'Failed to update customer'
      });
    } else {
      this.customerService.addCustomer(customer).subscribe({
        next: () => this.router.navigate(['/customers']),
        error: () => this.error = 'Failed to add customer'
      });
    }
  }
}
