import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r hidden md:flex flex-col">
        <div class="h-16 flex items-center px-6 border-b">
          <span class="text-xl font-bold text-indigo-600">Admin Panel</span>
        </div>
        <nav class="flex-grow p-4 space-y-2">
          <a routerLink="/admin" routerLinkActive="bg-indigo-50 text-indigo-600" [routerLinkActiveOptions]="{exact: true}" class="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="font-medium">Dashboard</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            <span class="font-medium">Categories</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            <span class="font-medium">Products</span>
          </a>
          <div class="pt-4 mt-4 border-t">
            <a routerLink="/" class="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              <span class="font-medium">Back to Store</span>
            </a>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow flex flex-col">
        <header class="h-16 bg-white border-b flex items-center justify-between px-8">
          <h2 class="text-xl font-bold text-gray-800">Overview</h2>
          <div class="flex items-center space-x-4">
             <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">A</div>
          </div>
        </header>

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
      </main>
    </div>
  `,
  styles: ``,
})
export class Dashboard {

}
