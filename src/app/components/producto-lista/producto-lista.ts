import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/products';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-lista.html',
  styleUrls: ['./producto-lista.css']
})
export class ProductoListaComponent {
  products: Product[] = [
    { id: 1, name: 'Laptop Gamer', description: 'Laptop de alto rendimiento', price: 2500, image: 'https://images.pexels.com/photos/8251149/pexels-photo-8251149.jpeg' },
{ id: 2, name: 'Auriculares', description: 'Auriculares con cancelación de ruido', price: 200, image: 'https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg' },
{ id: 3, name: 'Smartphone', description: 'Celular gama alta', price: 1500, image: 'https://images.pexels.com/photos/6078127/pexels-photo-6078127.jpeg' },
  ];

  constructor(private cartService: CartService) {}

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(`${product.name} agregado al carrito`);
  }
}

