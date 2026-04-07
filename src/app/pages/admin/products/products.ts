import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { Product, Category, ProductImage } from '../../../models/store.models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 pb-40 max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-16">
        <div>
          <h1 class="text-5xl font-serif font-black text-gray-900 italic">Bóveda de Joyas</h1>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-2">Gestión del Inventario de Lujo</p>
        </div>
        <button (click)="startAdd()" class="btn-primary px-10 py-4 uppercase tracking-widest text-[10px] shadow-xl shadow-gold/10">
          Nueva Pieza
        </button>
      </div>

      <!-- Add/Edit Modal (Overlay) -->
      <div *ngIf="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
        <div class="bg-white w-full max-w-3xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-400 border border-rose-100">
          <div class="px-12 py-10 border-b border-rose-50 flex justify-between items-center bg-[#fcf9f8]">
            <h2 class="text-2xl font-serif font-black text-gray-900 italic uppercase tracking-tighter">{{editingProduct ? 'Perfeccionar' : 'Nueva'}} Pieza</h2>
            <button (click)="cancel()" class="w-10 h-10 rounded-full bg-white border border-rose-50 flex items-center justify-center text-gray-400 hover:text-gold transition-all shadow-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div class="p-12 max-h-[75vh] overflow-y-auto space-y-10 custom-scrollbar">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div class="col-span-full space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nombre de la Joya</label>
                <input [(ngModel)]="productForm.name" (input)="onNameChange()" type="text" class="w-full px-8 py-5 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all placeholder:text-gray-200 font-medium">
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Categoría</label>
                <select [(ngModel)]="productForm.category_id" class="w-full px-8 py-5 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all appearance-none font-medium">
                  <option *ngFor="let cat of categories" [value]="cat.id">{{cat.name}}</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Precio de Venta</label>
                <input [(ngModel)]="productForm.price" type="number" step="0.01" class="w-full px-8 py-5 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all font-medium">
              </div>
              <div class="col-span-full space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Slug (URL)</label>
                <input [(ngModel)]="productForm.slug" type="text" class="w-full px-8 py-5 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all placeholder:text-gray-200 font-medium font-mono text-xs">
              </div>
              <div class="col-span-full space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Descripción Artesanal</label>
                <textarea [(ngModel)]="productForm.description" rows="4" class="w-full px-8 py-5 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all placeholder:text-gray-200 font-medium"></textarea>
              </div>
              
              <!-- Multiple Images -->
              <div class="col-span-full space-y-4">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Gelería de Imágenes</label>
                <div class="relative group cursor-pointer">
                  <input type="file" (change)="onFileSelected($event)" multiple accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                  <div class="w-full py-10 border-2 border-dashed border-rose-100 rounded-[2.5rem] bg-[#fcf9f8] group-hover:bg-rose-50/30 transition-all flex flex-col items-center justify-center text-center">
                    <svg class="w-10 h-10 text-rose-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Haz clic para subir imágenes sublimes</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-3 gap-6 pt-4">
                  <div *ngFor="let url of images; let i = index" class="relative group aspect-[3/4] rounded-3xl overflow-hidden border border-rose-50 shadow-sm transition-all hover:shadow-lg">
                    <img [src]="url" class="w-full h-full object-cover">
                    <button (click)="removeImageSlot(i)" class="absolute top-3 right-3 bg-red-400 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-12 py-10 bg-[#fcf9f8] border-t border-rose-50 flex justify-between items-center">
            <div *ngIf="uploading" class="flex items-center text-gold space-x-4">
               <div class="animate-spin h-5 w-5 border-2 border-gold border-t-transparent rounded-full"></div>
               <span class="text-[10px] font-black uppercase tracking-widest">Subiendo...</span>
            </div>
            <button (click)="cancel()" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors ml-auto">Cancelar</button>
            <button (click)="save()" [disabled]="uploading" class="btn-primary px-12 py-4 uppercase tracking-widest text-[10px] ml-10 shadow-xl shadow-gold/10">
              Guardar Joya
            </button>
          </div>
        </div>
      </div>

      <!-- Product List -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        <div *ngFor="let prod of products" class="bg-white rounded-[3rem] shadow-sm border border-rose-50 p-8 flex flex-col hover:shadow-2xl hover:bg-[#fcf9f8]/30 transition-all duration-500 group">
          <div class="flex space-x-6 mb-8">
            <div class="w-28 h-36 bg-[#fcf9f8] rounded-[2rem] overflow-hidden shadow-sm border border-rose-50 flex-shrink-0 group-hover:scale-105 transition-transform duration-700">
              <img [src]="(prod.images?.[0]?.image_url) || 'https://via.placeholder.com/200'" 
                   class="w-full h-full object-cover">
            </div>
            <div class="flex-grow pt-2 flex flex-col">
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-gold mb-2 italic">{{prod.category?.name}}</span>
              <h3 class="text-xl font-serif font-black text-gray-900 leading-tight italic line-clamp-2 mb-2">{{prod.name}}</h3>
              <p class="text-2xl font-light tracking-tighter text-gray-900 mt-auto">{{prod.price | currency}}</p>
            </div>
          </div>
          
          <div class="flex justify-between items-center mt-auto pt-6 border-t border-rose-50/50">
            <span class="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">ID: {{prod.id.toString().split('-')[0]}}</span>
            <div class="flex space-x-2">
              <button (click)="edit(prod)" class="w-10 h-10 rounded-xl bg-white border border-rose-50 text-gray-300 hover:text-gold hover:border-gold flex items-center justify-center transition-all shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
              <button (click)="delete(prod.id)" class="w-10 h-10 rounded-xl bg-white border border-rose-50 text-gray-200 hover:text-red-400 hover:border-red-100 flex items-center justify-center transition-all shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="products.length === 0" class="col-span-full py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-rose-50">
          <p class="text-sm font-serif italic text-gray-300 uppercase tracking-[0.4em]">El catálogo está vacío actualmente</p>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Products implements OnInit {
  products: any[] = [];
  categories: Category[] = [];
  showForm = false;
  editingProduct: any | null = null;
  uploading = false;

  productForm = {
    name: '',
    description: '',
    price: 0,
    category_id: null as any,
    slug: ''
  };
  images: string[] = []; // URLs of images (newly uploaded or existing)

  constructor(private supabase: SupabaseService) { }

  async ngOnInit() {
    this.load();
    const { data } = await this.supabase.getCategories();
    this.categories = data || [];
  }

  async load() {
    const { data } = await this.supabase.getProducts();
    this.products = data || [];
  }

  startAdd() {
    this.showForm = true;
    this.editingProduct = null;
    this.productForm = { name: '', description: '', price: 0, category_id: this.categories[0]?.id, slug: '' };
    this.images = [];
  }

  edit(prod: any) {
    this.editingProduct = prod;
    // Only copy relevant fields to prevent pollution
    this.productForm = {
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category_id: prod.category_id,
      slug: prod.slug
    };
    this.images = (prod.images || prod.product_images)?.map((img: any) => img.image_url) || [];
    this.showForm = true;
  }

  cancel() {
    this.showForm = false;
    this.editingProduct = null;
  }

  async onFileSelected(event: any) {
    const files = event.target.files as FileList;
    if (files.length > 0) {
      this.uploading = true;
      try {
        for (let i = 0; i < files.length; i++) {
          const url = await this.supabase.uploadImage(files[i]);
          this.images.push(url);
        }
      } catch (e) {
        console.error('Upload failed', e);
        alert('Error al subir una o más imágenes');
      } finally {
        this.uploading = false;
      }
    }
  }

  removeImageSlot(index: number) {
    this.images.splice(index, 1);
  }

  async save() {
    this.uploading = true;
    try {
      let productId = this.editingProduct?.id;

      // Ensure slug is unique
      let finalSlug = this.productForm.slug || this.generateSlug(this.productForm.name);
      let isUnique = false;
      let counter = 0;
      let currentSlug = finalSlug;

      while (!isUnique) {
        const { data: existing } = await this.supabase.client
          .from('products')
          .select('id')
          .eq('slug', currentSlug)
          .neq('id', productId || -1) // Exclude current product if editing
          .maybeSingle();

        if (existing) {
          counter++;
          currentSlug = `${finalSlug}-${counter}`;
        } else {
          isUnique = true;
          this.productForm.slug = currentSlug;
        }
      }

      // 1. Save Product
      if (this.editingProduct) {
        await this.supabase.client.from('products').update(this.productForm).eq('id', productId);
      } else {
        const { data, error } = await this.supabase.client.from('products').insert([this.productForm]).select();
        if (error) throw error;
        productId = data?.[0].id;
      }

      if (productId) {
        // 2. Handle Images (Sync: Delete old and insert new for simplicity)
        await this.supabase.client.from('product_images').delete().eq('product_id', productId);
        const imageObjects = this.images
          .map(url => ({ product_id: productId, image_url: url }));

        if (imageObjects.length > 0) {
          await this.supabase.client.from('product_images').insert(imageObjects);
        }
      }

      this.cancel();
      this.load();
    } catch (e) {
      console.error('Save failed', e);
      alert('Error al guardar la joya');
    } finally {
      this.uploading = false;
    }
  }

  onNameChange() {
    if (!this.editingProduct) {
      this.productForm.slug = this.generateSlug(this.productForm.name);
    }
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-'); // Remove consecutive -
  }

  async delete(id: any) {
    if (confirm('¿Eliminar esta joya de la bóveda?')) {
      await this.supabase.client.from('product_images').delete().eq('product_id', id);
      await this.supabase.client.from('products').delete().eq('id', id);
      this.load();
    }
  }
}
