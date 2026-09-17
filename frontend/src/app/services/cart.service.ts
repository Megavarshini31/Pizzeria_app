import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';

const STORAGE_KEY = 'pizzeria-cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  private get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private browsing, quota, etc.) - fail silently
    }
  }

  private emit(items: CartItem[]): void {
    this.itemsSubject.next(items);
    this.saveToStorage(items);
  }

  addItem(newItem: CartItem): void {
    const existing = this.items.find(i => i.id === newItem.id && !i.isCustom);
    if (existing) {
      existing.quantity += newItem.quantity;
      this.emit([...this.items]);
    } else {
      this.emit([...this.items, newItem]);
    }
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(id);
      return;
    }
    const updated = this.items.map(i => i.id === id ? { ...i, quantity } : i);
    this.emit(updated);
  }

  incrementQuantity(id: string): void {
    const item = this.items.find(i => i.id === id);
    if (item) this.updateQuantity(id, item.quantity + 1);
  }

  decrementQuantity(id: string): void {
    const item = this.items.find(i => i.id === id);
    if (item) this.updateQuantity(id, item.quantity - 1);
  }

  removeItem(id: string): void {
    this.emit(this.items.filter(i => i.id !== id));
  }

  clearCart(): void {
    this.emit([]);
  }

  getItemCount(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  getPizzaSubtotal(): number {
    return this.items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
  }

  getIngredientsSubtotal(): number {
    return this.items.reduce((sum, i) => {
      const extras = i.extraIngredients?.reduce((s, e) => s + e.price, 0) || 0;
      return sum + (extras * i.quantity);
    }, 0);
  }

  getTotal(): number {
    return this.getPizzaSubtotal() + this.getIngredientsSubtotal();
  }
}