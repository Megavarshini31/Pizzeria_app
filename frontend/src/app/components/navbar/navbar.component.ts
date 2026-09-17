import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="links">
      <a routerLink="/" class="brand">
        <span class="brand-text">Pizzeria</span>
        <img src="assets/images/logo/pizzeria-logo.png" alt="Pizzeria logo" class="logo">
        </a>
        <a routerLink="/order-pizza" routerLinkActive="active">Order Pizza</a>
        <a routerLink="/build-pizza" routerLinkActive="active">Build your Pizza</a>
        <a routerLink="/my-orders" routerLinkActive="active"> My Orders</a>
           
      </div>
      <a routerLink="/cart" class="cart-btn">
        🛒 Shopping Cart
        <span class="badge" *ngIf="itemCount > 0">{{ itemCount }}</span>
      </a>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #1c1c1c;
      color: #fff;
      padding: 18px 18px;
    }
    .brand { display: flex; align-items: center; gap: 12px; color: #fff; }
    .brand-text { font-size: 20px; font-weight: 600; }
    .logo {
      height: 40px;
      width: auto;
      object-fit: contain;
    }
    .links { display: flex; align-items: center; gap: 12px; }
    .links a { color: #ddd; font-size: 14px; }
    .links a.active, .links a:hover { color: #ffb300; }
    .cart-btn {
      background: #ffb300;
      color: #1c1c1c;
      font-weight: 600;
      padding: 10px 12px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
    }
    .badge {
      background: #1c1c1c;
      color: #fff;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
  `]
})
export class NavbarComponent implements OnInit {
  itemCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(() => {
      this.itemCount = this.cartService.getItemCount();
    });
  }
}