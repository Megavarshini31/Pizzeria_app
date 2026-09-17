import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h2>My Orders</h2>

      <div *ngIf="loading" class="status">Loading orders...</div>
      <div *ngIf="error" class="status error">{{ error }}</div>
      <div *ngIf="!loading && !error && orders.length === 0" class="status">
        No orders yet. Go build a pizza!
      </div>

      <div class="order-card" *ngFor="let order of orders">
        <div class="order-header">
          <span class="order-date">{{ order.createdAt | date:'medium' }}</span>
          <span class="order-total">₹{{ order.total.toFixed(2) }}</span>
        </div>
        <div class="order-item" *ngFor="let item of order.items">
          <span>{{ item.name }} &times; {{ item.quantity }}</span>
          <span *ngIf="item.extraIngredients?.length" class="extras">
            + {{ extrasLabel(item.extraIngredients) }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 700px; margin: 24px auto; padding: 0 24px; }
    h2 { font-weight: 400; }
    .status { text-align: center; color: #777; padding: 40px; }
    .status.error { color: #c0392b; }
    .order-card {
      background: #fff; border: 1px solid #eee; border-radius: 4px;
      padding: 16px; margin-bottom: 12px;
    }
    .order-header {
      display: flex; justify-content: space-between; font-weight: 700;
      padding-bottom: 8px; margin-bottom: 8px; border-bottom: 1px solid #f0f0f0;
    }
    .order-date { color: #888; font-weight: 400; font-size: 13px; }
    .order-item {
      display: flex; justify-content: space-between; font-size: 14px;
      color: #555; padding: 4px 0;
    }
    .extras { color: #999; font-size: 12px; }
  `]
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => {
        this.error = 'Could not load orders. Is the backend server running?';
        this.loading = false;
      }
    });
  }

  extrasLabel(extras?: { name: string; price: number }[]): string {
    return (extras || []).map(e => e.name).join(', ');
  }
}