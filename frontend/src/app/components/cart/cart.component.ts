import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="left">
        <h2>My Cart</h2>

        <div class="empty" *ngIf="items.length === 0">
          Your cart is empty. Go add some pizza!
        </div>

        <div class="item" *ngFor="let item of items">
          <img [src]="item.image" [alt]="item.name">
          <div class="details">
            <div class="name">{{ item.name }}</div>
            <div class="unit-price">₹{{ item.unitPrice }}</div>
            <div class="extras" *ngIf="item.extraIngredients?.length">
              + {{ extrasLabel(item) }}
            </div>
          </div>
          <div class="qty">
            <button (click)="dec(item)">-</button>
            <span>{{ item.quantity }}</span>
            <button (click)="inc(item)">+</button>
          </div>
          <div class="line-total">₹{{ lineTotal(item).toFixed(2) }}</div>
          <button class="remove" (click)="remove(item)">🗑</button>
        </div>

        <div class="subtotal" *ngIf="items.length > 0">
          Sub Total : ₹{{ pizzaSubtotal.toFixed(2) }}
        </div>
      </div>

      <div class="right">
        <h3>The total amount of</h3>
        <div class="row"><span>Pizza</span><span>₹{{ pizzaSubtotal.toFixed(2) }}</span></div>
        <div class="row ingredients-row" (click)="ingredientsOpen = !ingredientsOpen">
          <span>Ingredients <span class="caret" [class.open]="ingredientsOpen">&#8964;</span></span>
          <span>₹{{ ingredientsSubtotal.toFixed(2) }}</span>
        </div>
        <div class="ingredients-dropdown" *ngIf="ingredientsOpen">
          <div *ngIf="allExtras.length === 0" class="no-extras">No extra ingredients added</div>
          <div class="extra-line" *ngFor="let extra of allExtras">
            <span>{{ extra.name }}</span>
            <span>₹{{ extra.price.toFixed(2) }}</span>
          </div>
        </div>
        <hr>
        <div class="row total"><span>Total :</span><span>₹{{ total.toFixed(2) }}</span></div>
        <div class="actions">
          <button class="pay" [disabled]="items.length === 0 || placingOrder" (click)="pay()">
            {{ placingOrder ? 'Placing order...' : 'Pay' }}
          </button>
          <button class="clear" (click)="clear()">Clear</button>
        </div>
        <div class="order-error" *ngIf="orderError">{{ orderError }}</div>
      </div>
    </div>
  `,
  styles: [`
    .page { display: flex; gap: 24px; max-width: 1000px; margin: 24px auto; padding: 0 24px; }
    .left { flex: 2; background: #fff; border: 1px solid #eee; border-radius: 4px; padding: 20px; }
    .right { flex: 1; background: #fff; border: 1px solid #eee; border-radius: 4px; padding: 20px; height: fit-content; }
    h2 { font-weight: 400; }
    .empty { color: #999; padding: 24px 0; }
    .item {
      display: flex; align-items: center; gap: 12px; padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .item img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
    .details { flex: 1; }
    .name { font-weight: 600; }
    .unit-price, .extras { font-size: 12px; color: #888; }
    .qty { display: flex; align-items: center; gap: 8px; background: #f2f2f2; border-radius: 4px; padding: 4px 8px; }
    .qty button { background: #555; color: #fff; border: none; width: 22px; height: 22px; border-radius: 3px; }
    .line-total { width: 80px; text-align: right; font-weight: 600; }
    .remove { background: none; border: none; color: #e74c3c; font-size: 16px; }
    .subtotal { text-align: right; font-weight: 700; margin-top: 12px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; color: #555; }
    .row.total { font-weight: 700; color: #1c1c1c; font-size: 16px; }
    .ingredients-row { cursor: pointer; user-select: none; }
    .caret { display: inline-block; transition: transform 0.15s ease; font-size: 12px; }
    .caret.open { transform: rotate(180deg); }
    .ingredients-dropdown {
      background: #f9f9f9; border-radius: 4px; padding: 8px 12px; margin-bottom: 4px;
    }
    .no-extras { color: #999; font-size: 12px; padding: 4px 0; }
    .extra-line {
      display: flex; justify-content: space-between; font-size: 13px;
      color: #666; padding: 3px 0;
    }
    .actions { display: flex; gap: 8px; margin-top: 16px; }
    .pay, .clear { flex: 1; padding: 10px; border: none; border-radius: 4px; font-weight: 700; }
    .pay { background: #ffb300; }
    .pay:disabled { opacity: 0.5; cursor: not-allowed; }
    .clear { background: #1c1c1c; color: #fff; }
    .order-error { color: #e74c3c; font-size: 13px; margin-top: 10px; }

    @media (max-width: 720px) {
      .page { flex-direction: column; padding: 0 16px; }
      .item { flex-wrap: wrap; }
      .details { flex-basis: 100%; order: 1; }
      .qty { order: 2; }
      .line-total { order: 3; width: auto; }
      .remove { order: 4; }
    }
  `]
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  placingOrder = false;
  orderError = '';
  ingredientsOpen = false;

  constructor(private cartService: CartService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => this.items = items);
  }

  get pizzaSubtotal(): number { return this.cartService.getPizzaSubtotal(); }
  get ingredientsSubtotal(): number { return this.cartService.getIngredientsSubtotal(); }
  get total(): number { return this.cartService.getTotal(); }

  get allExtras(): { name: string; price: number }[] {
    const list: { name: string; price: number }[] = [];
    for (const item of this.items) {
      for (const extra of item.extraIngredients || []) {
        list.push({ name: extra.name, price: extra.price * item.quantity });
      }
    }
    return list;
  }

  lineTotal(item: CartItem): number {
    const extras = item.extraIngredients?.reduce((s, e) => s + e.price, 0) || 0;
    return (item.unitPrice + extras) * item.quantity;
  }

  extrasLabel(item: CartItem): string {
    return (item.extraIngredients || []).map(e => e.name).join(', ');
  }

  inc(item: CartItem): void { this.cartService.incrementQuantity(item.id); }
  dec(item: CartItem): void { this.cartService.decrementQuantity(item.id); }
  remove(item: CartItem): void { this.cartService.removeItem(item.id); }
  clear(): void { this.cartService.clearCart(); }

  pay(): void {
    if (this.items.length === 0 || this.placingOrder) return;

    this.orderError = '';
    this.placingOrder = true;

    const order = {
      items: this.items.map(i => ({
        name: i.name,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        extraIngredients: i.extraIngredients || []
      })),
      pizzaSubtotal: this.pizzaSubtotal,
      ingredientsSubtotal: this.ingredientsSubtotal,
      total: this.total
    };

    this.orderService.placeOrder(order).subscribe({
      next: () => {
        this.placingOrder = false;
        alert(`Payment of ₹${this.total.toFixed(2)} confirmed. Thank you for your order!`);
        this.cartService.clearCart();
      },
      error: () => {
        this.placingOrder = false;
        this.orderError = 'Could not save your order. Is the backend server running? Please try again.';
      }
    });
  }
}