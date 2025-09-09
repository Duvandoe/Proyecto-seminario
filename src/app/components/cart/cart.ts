import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';
import { Product } from '../../models/products';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  constructor(private cartService: CartService) {}

  get cartItems(): Product[] {
    return this.cartService.getCart();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  checkout() {
    alert('Compra realizada con éxito 🛒✅');
    this.cartService.clearCart();
  }
}

