import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-white pb-32">
      <!-- Nav Ethereal -->
      <nav class="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-rose-50 px-10 h-24 flex items-center justify-between">
        <a routerLink="/" class="text-[10px] font-black tracking-widest text-gray-400 hover:text-gold transition-colors">VOLVER A LA BOUTIQUE</a>
        <div class="flex flex-col items-center">
            <span class="text-2xl font-serif font-black italic text-gray-900 leading-none">Mary</span>
            <span class="text-[8px] font-bold tracking-[0.4em] text-gold uppercase">Boutique</span>
        </div>
        <a routerLink="/cart" class="relative group">
          <span class="text-[10px] font-black tracking-widest text-gray-900 group-hover:text-gold transition-colors">BOLSA</span>
          <span *ngIf="cartCount() > 0" class="absolute -top-3 -right-3 w-5 h-5 bg-gold text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-lg border-2 border-white">{{ cartCount() }}</span>
        </a>
      </nav>

      <div *ngIf="loading" class="flex flex-col items-center justify-center py-40">
        <div class="animate-spin rounded-xl h-8 w-8 border-2 border-gold border-t-transparent"></div>
        <p class="mt-8 text-[10px] font-bold text-gray-300 tracking-[0.3em] uppercase">Curando Detalles...</p>
      </div>

      <div *ngIf="product && !loading" class="max-w-7xl mx-auto mt-20 px-10 grid grid-cols-1 lg:grid-cols-2 gap-32 animate-fade-in">
        <!-- Gallery Minimalist -->
        <div class="space-y-10">
          <div class="aspect-[3/4] bg-[#fcf9f8] rounded-[3rem] overflow-hidden shadow-sm border border-rose-50">
            <img [src]="currentImage || 'https://via.placeholder.com/600x800'" class="w-full h-full object-cover">
          </div>
          <div class="grid grid-cols-4 gap-6" *ngIf="product.images?.length > 1">
            <button *ngFor="let img of product.images" 
              (click)="currentImage = img.image_url"
              class="aspect-square rounded-2xl overflow-hidden border transition-all"
              [class.border-gold]="currentImage === img.image_url"
              [class.border-rose-50]="currentImage !== img.image_url">
              <img [src]="img.image_url" class="w-full h-full object-cover">
            </button>
          </div>
        </div>

        <!-- Purchase Info -->
        <div class="flex flex-col py-10">
          <span class="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-4">{{ product.category?.name }}</span>
          <h1 class="text-6xl font-serif font-black text-gray-900 mb-6 italic leading-tight">{{ product.name }}</h1>
          <p class="text-4xl font-light tracking-tighter text-gray-900 mb-12">{{ product.price | currency }}</p>
          
          <div class="prose prose-rose text-lg text-gray-500 font-light leading-relaxed mb-16 max-w-md">
            {{ product.description }}
          </div>

          <div class="space-y-6">
            <button (click)="addToCart()" 
              class="btn-primary w-full uppercase tracking-widest text-xs">Añadir a la Bolsa</button>
            <p class="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">Envío gratuito en todas nuestras piezas</p>
          </div>

          <div class="mt-20 pt-10 border-t border-rose-50 space-y-6">
             <div class="flex items-center space-x-4">
               <div class="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-gold"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg></div>
               <span class="text-xs font-bold text-gray-900 uppercase tracking-widest">Excelencia Artesanal</span>
             </div>
             <div class="flex items-center space-x-4">
               <div class="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-gold"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg></div>
               <span class="text-xs font-bold text-gray-900 uppercase tracking-widest">Diseñado para ti</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProductDetail implements OnInit {
  product: any = null;
  loading = true;
  currentImage = '';

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    public cartService: CartService
  ) {}

  cartCount() {
    return this.cartService.count();
  }

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      const { data, error } = await this.supabase.getProductBySlug(slug);
      if (data) {
        this.product = data;
        this.currentImage = data.images?.[0]?.image_url || '';
      }
      this.loading = false;
    }
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }
}
