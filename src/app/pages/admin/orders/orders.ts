import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-end mb-12">
        <div>
          <h2 class="text-4xl font-serif font-black text-gray-900 italic">Ventas</h2>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Seguimiento de pedidos boutique</p>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] shadow-sm border border-rose-50 overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-rose-50 bg-[#fcf9f8]">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">ID</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Cliente</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gold text-right">Total</th>
              <th class="px-8 py-6"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-rose-50">
            <tr *ngFor="let order of orders" class="hover:bg-rose-50/30 transition-colors">
              <td class="px-8 py-6 text-xs font-black text-gray-300 text-center uppercase">{{ order.id.split('-')[0] }}</td>
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="font-serif font-black text-gray-900">{{ order.customers?.first_name }} {{ order.customers?.last_name }}</span>
                  <span class="text-[10px] text-gray-400">{{ order.customers?.email }}</span>
                </div>
              </td>
              <td class="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {{ order.order_date | date:'mediumDate' }}
              </td>
              <td class="px-8 py-6 text-right font-serif font-black text-gray-900 text-lg italic">
                {{ order.total_amount | currency }}
              </td>
              <td class="px-8 py-6 text-right">
                <button [routerLink]="['/admin/orders', order.id]" class="text-[10px] font-black text-gold border-b-2 border-gold/20 hover:border-gold transition-all uppercase tracking-widest pb-1">Ver Detalle</button>
              </td>
            </tr>
            <tr *ngIf="orders.length === 0">
              <td colspan="5" class="px-8 py-20 text-center">
                 <p class="text-sm font-serif italic text-gray-400 uppercase tracking-[0.3em]">Aún no hay ventas registradas</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: ``
})
export class Orders implements OnInit {
  orders: any[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const { data } = await this.supabase.getOrders();
    this.orders = data || [];
  }
}
