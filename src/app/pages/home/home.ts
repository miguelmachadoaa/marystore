import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { Product } from '../../models/store.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Navbar -->
      <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex-shrink-0 flex items-center">
              <span class="text-2xl font-bold text-indigo-600">MiniStore</span>
            </div>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="/admin" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Admin</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <header class="bg-indigo-600 py-16 px-4 text-center text-white">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4">New Arrivals</h1>
        <p class="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
          Discover our latest collection of premium products, curated just for you.
        </p>
      </header>

      <!-- Category Filter (Simplified) -->
      <div class="bg-white border-b overflow-x-auto whitespace-nowrap px-4 py-3 scrollbar-hide">
        <div class="inline-flex space-x-2">
          <button class="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-sm font-medium">All</button>
          <button class="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">Tech</button>
          <button class="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">Home</button>
          <button class="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">Fashion</button>
        </div>
      </div>

      <!-- Main Content -->
      <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Product Card Placeholder -->
          <div *ngFor="let product of products" class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100">
            <div class="relative aspect-[4/5] bg-gray-100 overflow-hidden">
               <img [src]="product.images?.[0]?.image_url || 'https://via.placeholder.com/400x500'" 
                   alt="Product image" 
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
               <div class="absolute top-4 right-4">
                 <button class="p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-900 hover:bg-white shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                   </svg>
                 </button>
               </div>
            </div>
            <div class="p-5 flex flex-col flex-grow">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{{product.name}}</h3>
                <span class="text-lg font-black text-indigo-600">{{product.price | currency}}</span>
              </div>
              <p class="text-sm text-gray-500 line-clamp-2 mb-4">{{product.description}}</p>
              <button class="mt-auto w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors active:scale-95 duration-200">
                Add to Cart
              </button>
            </div>
          </div>

          <!-- If no products -->
          <div *ngIf="products.length === 0" class="col-span-full py-20 text-center">
            <div class="mb-4 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-900">No products found</h3>
            <p class="text-gray-500 mt-2">Check back later or visit our admin area to add some!</p>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-gray-500 text-sm">
          <p>&copy; 2024 MiniStore. All rights reserved.</p>
          <div class="flex space-x-6">
            <a href="#" class="hover:text-indigo-600">Privacy</a>
            <a href="#" class="hover:text-indigo-600">Terms</a>
            <a href="#" class="hover:text-indigo-600">Contact</a>
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
  products: Product[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const { data, error } = await this.supabase.getProducts();
    if (data) {
      this.products = data;
    }
  }
}
