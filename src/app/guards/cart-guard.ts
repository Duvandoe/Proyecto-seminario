import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart';

@Injectable({
  providedIn: 'root'
})
export class CartGuard {
  constructor(private cartService: CartService, private router: Router) {}

  canActivate(): boolean {
    if (this.cartService.getCart().length > 0) {
      return true;
    } else {
      alert('El carrito está vacío. Agrega productos antes de continuar 🛒');
      this.router.navigate(['/products']);
      return false;
    }
  }
}

