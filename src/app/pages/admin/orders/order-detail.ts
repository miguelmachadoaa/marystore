import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-8 pb-32" *ngIf="order">
      <div class="flex items-center space-x-6 mb-12">
        <a routerLink="/admin/orders" class="p-3 bg-white rounded-2xl border border-rose-50 text-gray-400 hover:text-gold transition-all shadow-sm">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </a>
        <div>
          <h2 class="text-4xl font-serif font-black text-gray-900 italic">Detalle de Venta</h2>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Orden #{{ order.id }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- customer info -->
        <div class="lg:col-span-1 space-y-8">
           <div class="bg-white p-8 rounded-[2.5rem] border border-rose-50 shadow-sm space-y-6">
              <span class="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-4 flex border-b border-rose-50 pb-4">Cliente</span>
              <div class="space-y-4">
                <div class="flex flex-col">
                  <span class="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Nombre Completo</span>
                  <p class="font-serif font-black text-xl text-gray-900">{{ order.customers?.first_name }} {{ order.customers?.last_name }}</p>
                </div>
                <div class="flex flex-col">
                  <span class="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Email</span>
                  <p class="font-medium text-gray-600">{{ order.customers?.email }}</p>
                </div>
                <div class="flex flex-col">
                  <span class="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Teléfono</span>
                  <p class="font-medium text-gray-600">{{ order.customers?.phone }}</p>
                </div>
              </div>
           </div>

           <div class="bg-gray-900 p-8 rounded-[2.5rem] text-white space-y-6">
              <span class="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-4 flex border-b border-white/10 pb-4">Resumen de Pago</span>
              <div class="flex justify-between items-end">
                <span class="text-gray-400 font-serif italic text-lg uppercase tracking-tighter">TOTAL DE LA VENTA</span>
                <span class="text-3xl font-serif font-black text-gold italic">{{ total_amount | currency }}</span>
              </div>
           </div>
        </div>

        <!-- items -->
        <div class="lg:col-span-2">
           <div class="bg-white rounded-[2.5rem] border border-rose-50 shadow-sm overflow-hidden">
             <div class="p-8 border-b border-rose-50 bg-[#fcf9f8]">
               <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Joyas Adquiridas</h3>
             </div>
             <div class="divide-y divide-rose-50">
               <div *ngFor="let item of order.order_details" class="p-8 flex items-center space-x-8 hover:bg-rose-50/20 transition-colors">
                 <div class="w-20 h-24 bg-[#fcf9f8] rounded-2xl overflow-hidden shadow-sm border border-rose-50 flex-shrink-0">
                    <img [src]="item.products?.product_images?.[0]?.image_url || 'https://via.placeholder.com/200'" class="w-full h-full object-cover">
                 </div>
                 <div class="flex-grow space-y-1">
                   <h4 class="font-serif font-black text-xl text-gray-900 italic leading-none">{{ item.products?.name }}</h4>
                   <p class="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{{ item.products?.price | currency }} x {{ item.quantity }}</p>
                 </div>
                 <p class="text-xl font-serif font-black text-gray-900 italic">{{ item.price * item.quantity | currency }}</p>
               </div>

             </div>
           </div>
        </div>
      </div>
    </div>

    <div *ngIf="!order" class="py-40 text-center animate-fade-in">
        <div class="animate-spin rounded-xl h-8 w-8 border-2 border-gold border-t-transparent mx-auto"></div>
        <p class="mt-8 text-[10px] font-bold text-gray-300 tracking-[0.3em] uppercase">Obteniendo detalles del pedido...</p>
    </div>
  `,
  styles: ``
})
export class OrderDetail implements OnInit {
  order: any = null;

  get total_amount(): number {
    if (!this.order?.order_details) return 0;
    return this.order.order_details.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity, 0
    );
  }

  constructor(
    private supabase: SupabaseService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const { data } = await this.supabase.getOrderById(id);
      console.log(data);
      console.log('detail');
      this.order = data;
    }
  }
}
