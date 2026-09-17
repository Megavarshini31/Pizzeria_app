import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzaService } from '../../services/pizza.service';
import { CartService } from '../../services/cart.service';
import { Ingredient } from '../../models/ingredient.model';

const BASE_DOUGH_PRICE = 100; // base cost of dough/sauce/cheese before toppings

@Component({
  selector: 'app-build-pizza',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <p class="intro">
        Pizzeria now gives you options to build your own pizza. Customize your
        pizza by choosing ingredients from the list given below.
      </p>

      <div *ngIf="loading" class="status">Loading ingredients...</div>
      <div *ngIf="error" class="status error">{{ error }}</div>

      <table *ngIf="!loading && !error">
        <tbody>
          <tr *ngFor="let ing of ingredients">
            <td class="img-cell"><img [src]="ing.image" [alt]="ing.name"></td>
            <td class="name-cell">{{ ing.name }} &nbsp; ₹{{ ing.price.toFixed(2) }}</td>
            <td class="check-cell">
              <input type="checkbox"
                     [checked]="isSelected(ing)"
                     (change)="toggle(ing)">
              <span class="add-label">Add</span>
            </td>
          </tr>
        </tbody>
      </table>

      <p class="total" *ngIf="!loading && !error">Total Cost (With pizza base) : {{ totalCost }}</p>

      <button class="build-btn" [disabled]="selected.length === 0" (click)="buildPizza()">
        {{ justBuilt ? 'Added to Cart ✓' : 'Build Ur Pizza' }}
      </button>
    </div>
  `,
  styles: [`
    .page { max-width: 700px; margin: 0 auto; padding: 24px; }
    .intro { color: #555; margin-bottom: 16px; }
    .status { text-align: center; padding: 40px; color: #777; }
    .status.error { color: #c0392b; }
    table { width: 100%; border-collapse: collapse; }
    tr:nth-child(odd) { background: #f7f7f7; }
    td { padding: 8px 12px; vertical-align: middle; }
    .img-cell img { width: 40px; height: 40px; object-fit: cover; border-radius: 50%; }
    .name-cell { font-weight: 600; font-size: 14px; }
    .check-cell { display: flex; align-items: center; gap: 8px; }
    .add-label { color: #d18a00; font-size: 13px; font-weight: 600; }
    .total { font-weight: 700; color: #1c3fae; margin: 16px 0; }
    .build-btn {
      display: block;
      margin: 0 auto;
      background: black; color: #d18a00; border: none; padding: 12px 28px; border-radius: 4px;
      font-weight: 700; font-size: 14px;
    }
    .build-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class BuildPizzaComponent implements OnInit {
  ingredients: Ingredient[] = [];
  selected: Ingredient[] = [];
  loading = true;
  error = '';
  justBuilt = false;

  constructor(private pizzaService: PizzaService, private cartService: CartService) {}

  ngOnInit(): void {
    this.pizzaService.getIngredients().subscribe({
      next: (data) => { this.ingredients = data; this.loading = false; },
      error: () => {
        this.error = 'Could not load ingredients. Is the backend server running?';
        this.loading = false;
      }
    });
  }

  get totalCost(): number {
    const extras = this.selected.reduce((sum, i) => sum + i.price, 0);
    return BASE_DOUGH_PRICE + extras;
  }

  isSelected(ing: Ingredient): boolean {
    return this.selected.some(i => i._id === ing._id);
  }

  toggle(ing: Ingredient): void {
    if (this.isSelected(ing)) {
      this.selected = this.selected.filter(i => i._id !== ing._id);
    } else {
      this.selected = [...this.selected, ing];
    }
  }

  buildPizza(): void {
    if (this.selected.length === 0) return;
    this.cartService.addItem({
      id: 'custom-' + Date.now(),
      name: 'Custom Pizza',
      image: 'assets/images/pizzas/custom-pizza.jpg',
      unitPrice: BASE_DOUGH_PRICE,
      quantity: 1,
      isCustom: true,
      extraIngredients: this.selected.map(i => ({ name: i.name, price: i.price }))
    });
    this.justBuilt = true;
    this.selected = [];
    setTimeout(() => this.justBuilt = false, 1500);
  }
}