import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pizza } from '../models/pizza.model';
import { Ingredient } from '../models/ingredient.model';

@Injectable({ providedIn: 'root' })
export class PizzaService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getPizzas(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(`${this.apiUrl}/pizzas`);
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.apiUrl}/ingredients`);
  }
}
