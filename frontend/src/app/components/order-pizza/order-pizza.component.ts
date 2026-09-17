import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzaService } from '../../services/pizza.service';
import { CartService } from '../../services/cart.service';
import { Pizza } from '../../models/pizza.model';

@Component({
  selector: 'app-order-pizza',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div *ngIf="loading" class="status">Loading menu...</div>
      <div *ngIf="error" class="status error">{{ error }}</div>

      <div class="grid" *ngIf="!loading && !error">
        <div class="card" *ngFor="let pizza of pizzas">
          <div class="info">
            <div class="title-row">
              <h3>{{ pizza.name }}</h3>
              <span class="veg-box" [class.non-veg]="!pizza.isVeg" [attr.aria-label]="pizza.isVeg ? 'Veg' : 'Non-veg'">
                <span class="veg-dot"></span>
              </span>
            </div>
            <p class="desc">{{ pizza.description }}</p>
            <p class="meta"><strong>Ingredients:</strong> {{ pizza.ingredients }}</p>
            <p class="meta"><strong>Toppings:</strong> {{ pizza.toppings }}</p>
            <p class="price">₹{{ pizza.price.toFixed(2) }}</p>
          </div>
          <div class="side">
            <img [src]="pizza.image" [alt]="pizza.name">
            <button class="add-btn" (click)="addToCart(pizza)">
              {{ justAdded === pizza._id ? 'Added ✓' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1000px; margin: 0 auto; padding: 24px; }
    .status { text-align: center; padding: 40px; color: #777; }
    .status.error { color: #c0392b; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card {
      display: flex; justify-content: space-between; gap: 12px;
      background: #fff; border: 1px solid #eee; border-radius: 4px; padding: 16px;
    }
    .title-row { display: flex; align-items: center; gap: 8px; }
    h3 { margin: 0; }
    .veg-box {
      width: 16px; height: 16px;
      border: 2px solid #2ecc71;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .veg-box.non-veg { border-color: #e74c3c; }
    .veg-dot { width: 8px; height: 8px; border-radius: 50%; background: #2ecc71; }
    .veg-box.non-veg .veg-dot {
      width: 0; height: 0; background: transparent; border-radius: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 8px solid #e74c3c;
    }
    .desc, .meta { font-size: 13px; color: #666; margin: 6px 0; }
    .price { font-weight: 700; margin-top: 8px; }
    .side { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    img { width: 130px; height: 110px; object-fit: cover; border-radius: 4px; }
    .add-btn {
      background: #ffb300; border: none; padding: 8px 14px; border-radius: 4px;
      font-weight: 600; white-space: nowrap;
    }
    @media (max-width: 700px) {
      .grid { grid-template-columns: 1fr; }
    }
  `]
})
export class OrderPizzaComponent implements OnInit {
  pizzas: Pizza[] = [];
  loading = true;
  error = '';
  justAdded: string | null = null;

  constructor(private pizzaService: PizzaService, private cartService: CartService) {}

  ngOnInit(): void {
    this.pizzaService.getPizzas().subscribe({
      next: (data) => { this.pizzas = data; this.loading = false; },
      error: () => {
        this.error = 'Could not load the menu. Is the backend server running?';
        this.loading = false;
      }
    });
  }

  addToCart(pizza: Pizza): void {
    this.cartService.addItem({
      id: pizza._id,
      name: pizza.name,
      image: pizza.image,
      unitPrice: pizza.price,
      quantity: 1,
      isCustom: false
    });
    this.justAdded = pizza._id;
    setTimeout(() => this.justAdded = null, 1200);
  }
}