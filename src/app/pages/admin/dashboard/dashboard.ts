import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        <div class="bg-white p-10 rounded-[2.5rem] border border-rose-50 shadow-sm flex flex-col items-center text-center">
           <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 italic">Total de Joyas</p>
           <h3 class="text-4xl font-serif font-black text-gray-900 italic">24</h3>
        </div>
        <div class="bg-white p-10 rounded-[2.5rem] border border-rose-50 shadow-sm flex flex-col items-center text-center">
           <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 italic">Categorías</p>
           <h3 class="text-4xl font-serif font-black text-gray-900 italic">6</h3>
        </div>
        <div class="bg-white p-10 rounded-[2.5rem] border border-rose-50 shadow-sm flex flex-col items-center text-center">
           <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 italic">Órdenes Pendientes</p>
           <h3 class="text-4xl font-serif font-black text-gold italic">12</h3>
        </div>
      </div>

      <div class="bg-gray-900 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl shadow-rose-100 border border-rose-100/10">
        <div class="relative z-10 space-y-6">
          <div class="flex flex-col mb-8">
            <span class="text-3xl font-serif font-black italic text-gold leading-none">Bienvenida,</span>
            <span class="text-5xl font-serif font-black italic text-white leading-none">Administradora</span>
          </div>
          <p class="text-gray-400 text-lg font-light max-w-md leading-relaxed">Todo fluye con elegancia hoy. Tienes 5 nuevas clientas y 8 órdenes pendientes por procesar con amor.</p>
          <button routerLink="/admin/products" class="btn-primary px-10 py-4 uppercase tracking-[0.3em] text-[10px] bg-gold text-white hover:bg-white hover:text-gray-900 transform transition-all shadow-xl shadow-gold/20">Gestionar Inventario</button>
        </div>
        <div class="absolute -top-10 -right-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 p-10 opacity-10">
           <svg class="w-40 h-40 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 9h15L12 2zm0 3.8L15.2 9H8.8L12 5.8zM4.5 11l7.5 11 7.5-11h-15zm12.2 2L12 19.2 7.3 13h9.4z"/></svg>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Dashboard {

}
