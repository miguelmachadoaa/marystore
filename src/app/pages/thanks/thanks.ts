import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-thanks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#fcf9f8] flex items-center justify-center px-6">
      <div class="max-w-2xl w-full text-center py-20 animate-fade-in">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-sm border mb-10 text-gold">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"></path></svg>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-serif font-black text-gray-900 mb-6 italic">Thank You, <br>Gorgeous</h1>
        <p class="text-xl text-gray-500 font-light max-w-lg mx-auto mb-12 uppercase tracking-[0.2em]">Your order has been placed with love</p>
        
        <div class="bg-white rounded-[3rem] p-10 shadow-sm border border-rose-100 flex flex-col items-center mb-12">
          <p class="text-gray-400 font-medium mb-4 uppercase text-xs tracking-widest">Confirmation Sent</p>
          <p class="text-gray-900 font-serif italic text-lg mb-8">You will receive an email shortly with your order details and tracking information.</p>
          <button routerLink="/" class="btn-primary w-full max-w-xs">Return to Boutique</button>
        </div>

        <div class="flex items-center justify-center space-x-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <a href="#" class="hover:text-gold transition-colors">Instagram</a>
          <span>•</span>
          <a href="#" class="hover:text-gold transition-colors">Pinterest</a>
          <span>•</span>
          <a href="#" class="hover:text-gold transition-colors">Support</a>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Thanks {}
