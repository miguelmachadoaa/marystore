import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-6">
      <div class="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div class="p-8 md:p-12">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-extrabold text-gray-900">Admin Login</h2>
            <p class="mt-2 text-gray-600">Enter your credentials to manage your store</p>
          </div>

          <form (submit)="login($event)" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input [(ngModel)]="email" name="email" type="email" required 
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="admin@example.com">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input [(ngModel)]="password" name="password" type="password" required 
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="••••••••">
            </div>

            <div *ngIf="error" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium animate-pulse">
              {{ error }}
            </div>

            <button type="submit" [disabled]="loading" 
              class="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="mt-8 text-center pt-6 border-t border-gray-100">
             <a routerLink="/" class="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors flex items-center justify-center space-x-2">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
               <span>Back to Store</span>
             </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Login {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async login(event: Event) {
    event.preventDefault();
    this.loading = true;
    this.error = '';

    const { data, error } = await this.supabase.signInWithEmail(this.email, this.password);

    if (error) {
      this.error = error.message;
      this.loading = false;
    } else {
      this.router.navigate(['/admin']);
    }
  }
}
