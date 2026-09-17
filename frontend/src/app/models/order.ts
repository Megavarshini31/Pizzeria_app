export interface OrderItem {
  name: string;
  unitPrice: number;
  quantity: number;
  extraIngredients?: { name: string; price: number }[];
}

export interface Order {
  _id?: string;
  items: OrderItem[];
  pizzaSubtotal: number;
  ingredientsSubtotal: number;
  total: number;
  status?: string;
  createdAt?: string;
}