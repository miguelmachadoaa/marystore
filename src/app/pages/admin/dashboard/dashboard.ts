import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <p class="text-sm font-medium text-gray-500 mb-1">Total Products</p>
           <h3 class="text-3xl font-bold text-gray-900">24</h3>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <p class="text-sm font-medium text-gray-500 mb-1">Categories</p>
           <h3 class="text-3xl font-bold text-gray-900">6</h3>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <p class="text-sm font-medium text-gray-500 mb-1">Pending Orders</p>
           <h3 class="text-3xl font-bold text-gray-900">12</h3>
        </div>
      </div>

      <div class="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
        <div class="relative z-10">
          <h3 class="text-2xl font-bold mb-2">Welcome Back, Admin!</h3>
          <p class="text-indigo-100 max-w-md">Everything is looking good today. You have 5 new customers and 8 pending orders to process.</p>
          <button routerLink="/admin/products" class="mt-6 bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Manage Inventory</button>
        </div>
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Dashboard {

}
