import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r hidden md:flex flex-col sticky top-0 h-screen">
        <div class="h-16 flex items-center px-6 border-b">
          <span class="text-xl font-bold text-indigo-600">Admin Panel</span>
        </div>
        <nav class="flex-grow p-4 space-y-2">
          <a routerLink="/admin" routerLinkActive="bg-indigo-50 text-indigo-600" [routerLinkActiveOptions]="{exact: true}" class="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors border border-transparent">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="font-medium">Dashboard</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors border border-transparent">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            <span class="font-medium">Categories</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors border border-transparent">
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

      <!-- Main Content Area -->
      <div class="flex-grow flex flex-col min-h-screen">
        <header class="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 class="text-xl font-bold text-gray-800">Admin Control</h2>
          <div class="flex items-center space-x-4">
             <div class="text-right mr-2 hidden sm:block">
               <p class="text-xs font-bold text-gray-400 uppercase tracking-tighter">Current User</p>
               <p class="text-sm font-semibold text-gray-700">{{ userEmail }}</p>
             </div>
             <button (click)="logout()" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Logout">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
             </button>
             <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">A</div>
          </div>
        </header>

        <main class="flex-grow">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: ``,
})
export class AdminLayout implements OnInit {
  userEmail = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    const { data } = await this.supabase.getUser();
    this.userEmail = data.user?.email || 'Admin';
  }

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}
