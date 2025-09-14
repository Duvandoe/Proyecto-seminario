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
{ id: 4, name: 'PlayStation 4 Slim', description: 'consola con dos mandos, cable entrada hdmi con 1tb de alamcenamento', price: 1200, image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTI6X-YDDNKkogGnLDQ0EXmAKJoG_GbzVGp_VUWOSHFiiTYXclwlBzmUNaO16l0xcyLzmknDXMCBGQmcd6btu0yWYMu79gb8q1Y5bBKtGNLm_QV21l4r-J0'},
{ id: 5, name: 'TV LG de 43"', description: 'televisor con pantalla de alta resolucion smart TV webOS', price: 1800, image: 'https://buketomnisportpweb.s3.us-east-2.amazonaws.com/products-images/Zl7DLmikrn1OFpaBxwtUJeQi41WK37mT9FHuslJx.jpeg' },
  ];

  constructor(private cartService: CartService) {}

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(`${product.name} agregado al carrito`);
  }
}

