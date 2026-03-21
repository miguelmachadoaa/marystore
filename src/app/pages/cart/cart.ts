import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-white pb-32">
      <nav class="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-rose-50 px-10 h-24 flex items-center justify-between">
        <a routerLink="/" class="text-[10px] font-black tracking-widest text-gray-400 hover:text-gold transition-colors">CONTINUAR COMPRANDO</a>
        <div class="flex flex-col items-center">
            <span class="text-2xl font-serif font-black italic text-gray-900 leading-none">Mary</span>
            <span class="text-[8px] font-bold tracking-[0.4em] text-gold uppercase">Boutique</span>
        </div>
        <div class="w-20"></div>
      </nav>

      <div class="max-w-7xl mx-auto mt-20 px-10 grid grid-cols-1 lg:grid-cols-3 gap-24 animate-fade-in">
        <!-- List of Items -->
        <div class="lg:col-span-2 space-y-12">
          <div *ngIf="items().length === 0" class="py-20 text-center">
            <h2 class="text-4xl font-serif font-black text-gray-900 mb-6 italic">Tu bolsa está vacía</h2>
            <p class="text-lg text-gray-400 font-light mb-12 uppercase tracking-widest">Descubre algo especial</p>
            <button routerLink="/" class="btn-primary uppercase tracking-widest text-xs">Ver Colecciones</button>
          </div>

          <div *ngFor="let item of items()" class="flex items-center space-x-10 group bg-[#fcf9f8] p-8 rounded-[3rem] border border-rose-50 transition-all hover:shadow-xl hover:bg-white">
            <img [src]="item.image || 'https://via.placeholder.com/200'" class="w-32 h-40 object-cover rounded-2xl shadow-sm">
            <div class="flex-grow space-y-2">
              <span class="text-[9px] font-black uppercase tracking-widest text-gold italic">Pieza Acabada a Mano</span>
              <h3 class="font-serif font-black text-2xl text-gray-900">{{ item.name }}</h3>
              <p class="text-xl font-light text-gray-400">{{ item.price | currency }}</p>
              
              <div class="flex items-center space-x-8 pt-6">
                <div class="flex items-center space-x-4">
                  <button (click)="updateQty(item.id, item.quantity - 1)" class="w-8 h-8 rounded-full border border-rose-200 flex items-center justify-center hover:bg-gold hover:text-white hover:border-gold transition-all">-</button>
                  <span class="text-sm font-black">{{ item.quantity }}</span>
                  <button (click)="updateQty(item.id, item.quantity + 1)" class="w-8 h-8 rounded-full border border-rose-200 flex items-center justify-center hover:bg-gold hover:text-white hover:border-gold transition-all">+</button>
                </div>
                <button (click)="remove(item.id)" class="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors">Eliminar</button>
              </div>
            </div>
            <p class="text-2xl font-serif font-black text-gray-900">{{ item.price * item.quantity | currency }}</p>
          </div>
        </div>

        <!-- Checkout Section -->
        <div *ngIf="items().length > 0" class="lg:col-span-1">
          <div class="bg-white p-10 rounded-[4rem] border border-rose-100 shadow-2xl shadow-rose-100/50 sticky top-32">
            <h3 class="text-2xl font-serif font-black text-gray-900 mb-10 italic border-b border-rose-50 pb-6 uppercase tracking-tighter text-center">Resumen</h3>
            
            <div class="space-y-6 mb-12 text-sm font-bold uppercase tracking-widest text-gray-400">
              <div class="flex justify-between">
                <span>Valor</span>
                <span class="text-gray-900">{{ total() | currency }}</span>
              </div>
              <div class="flex justify-between">
                <span>Envío</span>
                <span class="text-gold italic">Cortesía</span>
              </div>
              <div class="flex justify-between text-xl font-black text-gray-900 pt-8 border-t border-rose-50">
                <span class="font-serif italic lowercase tracking-tighter">total</span>
                <span>{{ total() | currency }}</span>
              </div>
            </div>

            <!-- Checkout Form Boutique Style -->
            <div class="space-y-6">
              <span class="text-[9px] font-black text-gold uppercase tracking-[0.4em] mb-4 flex">Información de Entrega</span>
              <input [(ngModel)]="customer.firstName" placeholder="Nombre" class="w-full px-6 py-4 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all placeholder:text-gray-300 font-medium">
              <input [(ngModel)]="customer.lastName" placeholder="Apellido" class="w-full px-6 py-4 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all placeholder:text-gray-300 font-medium">
              <input [(ngModel)]="customer.email" placeholder="Correo Electrónico" class="w-full px-6 py-4 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all placeholder:text-gray-300 font-medium">
              <input [(ngModel)]="customer.phone" placeholder="Número de Teléfono" class="w-full px-6 py-4 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all placeholder:text-gray-300 font-medium">
            </div>

            <button (click)="checkout()" [disabled]="processing"
              class="w-full mt-10 btn-primary uppercase tracking-widest text-xs">
              {{ processing ? 'PROCESANDO...' : 'REALIZAR PEDIDO' }}
            </button>
            <p class="mt-8 text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest">Pago seguro encriptado</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Cart {
  processing = false;

  customer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };

  constructor(
    public cartService: CartService,
    private supabase: SupabaseService,
    private router: Router
  ) {}

  get items() {
    return this.cartService.items;
  }

  get total() {
    return this.cartService.total;
  }

  updateQty(pid: number, qty: number) {
    this.cartService.updateQuantity(pid, qty);
  }

  remove(pid: number) {
    this.cartService.removeFromCart(pid);
  }

  async checkout() {
    if (!this.customer.email || !this.customer.firstName) {
      alert('Por favor, completa tu información de contacto');
      return;
    }

    this.processing = true;
    try {
      await this.supabase.createOrder(this.customer, this.items());
      this.cartService.clearCart();
      this.router.navigate(['/thanks']);
    } catch (e) {
      console.error(e);
      alert('Error al crear el pedido. Por favor, inténtalo de nuevo.');
    } finally {
      this.processing = false;
    }
  }
}
