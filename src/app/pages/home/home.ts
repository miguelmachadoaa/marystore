import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen">
      <!-- Navbar Ethereal -->
      <nav class="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-rose-50">
        <div class="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-3xl font-serif font-black tracking-tighter italic text-gray-900 leading-none">Mary</span>
            <span class="text-[10px] font-bold tracking-[0.4em] text-gold uppercase ml-1">Boutique</span>
          </div>
          <div class="flex items-center space-x-10">
            <a routerLink="/admin" class="text-[10px] font-black tracking-widest text-gray-400 hover:text-gold transition-colors">ESTUDIO</a>
            <a routerLink="/cart" class="relative group">
              <span class="text-[10px] font-black tracking-widest text-gray-900 group-hover:text-gold transition-colors">BAG</span>
              <span *ngIf="cartCount() > 0" class="absolute -top-3 -right-3 w-5 h-5 bg-gold text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-lg shadow-gold/20">{{ cartCount() }}</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- Hero Cinematic -->
      <header class="relative bg-white pt-20 pb-32 px-10 overflow-hidden">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div class="flex-1 space-y-8 animate-fade-in relative z-10">
            <span class="inline-block text-[10px] font-black tracking-[0.5em] text-gold uppercase underline underline-offset-8 decoration-gold/30">New Collection 2024</span>
            <h1 class="text-6xl md:text-8xl font-serif font-black text-gray-900 leading-[0.9] italic">Timeless <br>Beauty.</h1>
            <p class="text-lg text-gray-500 font-light max-w-sm leading-relaxed">Handcrafted jewelry designed to celebrate the extraordinary woman you are.</p>
            <button class="btn-primary">EXPLORE THE DROP</button>
          </div>
          <div class="flex-1 relative">
            <div class="w-full aspect-[4/5] bg-[#fcf9f8] rounded-[4rem] overflow-hidden shadow-2xl relative group">
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop" class="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-1000">
              <div class="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"></div>
            </div>
            <!-- Decorative Elements -->
            <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl opacity-50"></div>
            <div class="absolute -top-10 -right-10 w-60 h-60 bg-gold/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </header>

      <!-- Category Navigation Minimal -->
      <div class="max-w-7xl mx-auto px-10 py-10 flex space-x-12 overflow-x-auto border-b border-rose-50 scrollbar-hide">
        <button class="text-xs font-black tracking-[0.3em] uppercase text-gray-900 border-b-2 border-gold pb-2">All Products</button>
        <button class="text-xs font-bold tracking-[0.3em] uppercase text-gray-300 hover:text-gray-900 transition-colors pb-2 border-b-2 border-transparent">Necklaces</button>
        <button class="text-xs font-bold tracking-[0.3em] uppercase text-gray-300 hover:text-gray-900 transition-colors pb-2 border-b-2 border-transparent">Earrings</button>
        <button class="text-xs font-bold tracking-[0.3em] uppercase text-gray-300 hover:text-gray-900 transition-colors pb-2 border-b-2 border-transparent">Rings</button>
      </div>

      <!-- Essence Grid -->
      <main class="max-w-7xl mx-auto px-10 py-24">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          <div *ngFor="let prod of products" class="group relative flex flex-col items-center text-center">
            <div [routerLink]="['/product', prod.slug]" class="relative w-full aspect-[3/4] bg-[#fcf9f8] rounded-[3rem] overflow-hidden mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700 cursor-pointer">
              <img [src]="prod.product_images?.[0]?.image_url || 'https://via.placeholder.com/600x800'" 
                   class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500"></div>
              <!-- Action Button Hover -->
              <div class="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <button (click)="$event.stopPropagation(); addToCart(prod)" class="bg-white text-gray-900 px-8 py-3 rounded-full font-black text-[10px] tracking-[0.2em] uppercase shadow-xl hover:bg-gold hover:text-white transition-all whitespace-nowrap">Fast Add</button>
              </div>
            </div>
            
            <span class="text-[9px] font-black uppercase tracking-[0.3em] text-gold mb-3">{{ prod.categories?.name }}</span>
            <h3 class="text-2xl font-serif font-black text-gray-900 mb-2 truncate max-w-full italic">{{ prod.name }}</h3>
            <p class="text-lg font-light tracking-tighter text-gray-400">{{ prod.price | currency }}</p>
          </div>
        </div>

        <!-- No products found Elegance -->
        <div *ngIf="products.length === 0" class="py-40 text-center">
            <p class="text-sm font-serif italic text-gray-400 uppercase tracking-[0.4em]">The vault is currently empty</p>
            <p class="mt-4 text-[10px] font-bold text-gray-300 tracking-widest uppercase">Sign up to get notified of the next drop</p>
        </div>
      </main>

      <!-- Editorial Footer -->
      <footer class="bg-white px-10 py-32 border-t border-rose-50">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32">
          <div class="space-y-10">
            <div class="flex flex-col">
              <span class="text-4xl font-serif font-black text-gray-900 leading-none italic">Mary</span>
              <span class="text-[12px] font-bold tracking-[0.4em] text-gold uppercase ml-1">Boutique</span>
            </div>
            <p class="text-xl text-gray-400 font-light leading-relaxed max-w-sm">Curating hand-finished elegance since 2024. Every piece tells a story of craftsmanship and love.</p>
          </div>
          <div class="grid grid-cols-2 gap-10">
             <div class="space-y-6">
               <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">Experience</h4>
               <ul class="space-y-4 text-sm text-gray-400 font-medium">
                 <li><a href="#" class="hover:text-gold transition-colors">Our Story</a></li>
                 <li><a href="#" class="hover:text-gold transition-colors">Artisan Care</a></li>
                 <li><a href="#" class="hover:text-gold transition-colors">Bespoke Design</a></li>
               </ul>
             </div>
             <div class="space-y-6">
               <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">Connections</h4>
               <ul class="space-y-4 text-sm text-gray-400 font-medium">
                 <li><a href="#" class="hover:text-gold transition-colors">Instagram</a></li>
                 <li><a href="#" class="hover:text-gold transition-colors">Journal</a></li>
               </ul>
             </div>
          </div>
        </div>
        <div class="max-w-7xl mx-auto pt-20 mt-20 border-t border-rose-50 flex justify-between items-center">
          <p class="text-[10px] font-bold text-gray-300 tracking-widest uppercase">© 2024 curated with love</p>
          <div class="flex space-x-6">
            <div class="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-200"><i class="fas fa-gem"></i></div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `],
})
export class Home implements OnInit {
  products: any[] = [];

  constructor(
    private supabase: SupabaseService,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    const { data } = await this.supabase.getProducts();
    this.products = data || [];
  }

  addToCart(prod: any) {
    this.cartService.addToCart(prod);
  }

  cartCount() {
    return this.cartService.count();
  }
}
