export interface CartItem {
  id: string;          
  name: string;
  image: string;
  unitPrice: number;    
  quantity: number;
  isCustom: boolean;
  extraIngredients?: { name: string; price: number }[];
}
