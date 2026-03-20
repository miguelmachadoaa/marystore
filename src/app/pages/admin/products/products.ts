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
    <div class="p-6 max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Manage Products</h1>
        <button (click)="startAdd()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Add Product
        </button>
      </div>

      <!-- Add/Edit Modal (Overlay) -->
      <div *ngIf="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="px-8 py-6 border-b flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">{{editingProduct ? 'Edit' : 'New'}} Product</h2>
            <button (click)="cancel()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div class="p-8 max-h-[70vh] overflow-y-auto space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-full">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                <input [(ngModel)]="productForm.name" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select [(ngModel)]="productForm.category_id" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option *ngFor="let cat of categories" [value]="cat.id">{{cat.name}}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Price</label>
                <input [(ngModel)]="productForm.price" type="number" step="0.01" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
              <div class="col-span-full">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Slug</label>
                <input [(ngModel)]="productForm.slug" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
              <div class="col-span-full">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea [(ngModel)]="productForm.description" rows="3" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
              </div>
              
              <!-- Multiple Images -->
              <div class="col-span-full">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Upload Images</label>
                <input type="file" (change)="onFileSelected($event)" multiple accept="image/*" class="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer">
                
                <div class="grid grid-cols-2 gap-4">
                  <div *ngFor="let url of images; let i = index" class="relative group aspect-square rounded-xl overflow-hidden border">
                    <img [src]="url" class="w-full h-full object-cover">
                    <button (click)="removeImageSlot(i)" class="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-8 py-6 bg-gray-50 flex justify-end space-x-4">
            <div *ngIf="uploading" class="flex items-center text-indigo-600 mr-auto">
               <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Uploading images...
            </div>
            <button (click)="cancel()" class="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button (click)="save()" [disabled]="uploading" class="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Product List -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let prod of products" class="bg-white rounded-2xl shadow-sm border p-6 flex flex-col hover:shadow-md transition-shadow">
          <div class="flex space-x-4 mb-4">
            <img [src]="prod.product_images?.[0]?.image_url || 'https://via.placeholder.com/100'" 
                 class="w-24 h-24 object-cover rounded-xl bg-gray-50 border shadow-inner">
            <div class="flex-grow">
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-500">{{prod.categories?.name}}</span>
              <h3 class="text-lg font-bold text-gray-900 truncate">{{prod.name}}</h3>
              <p class="text-xl font-black text-gray-800 mt-1">{{prod.price | currency}}</p>
            </div>
          </div>
          
          <div class="flex justify-between items-center mt-auto pt-4 border-t">
            <span class="text-sm text-gray-400 font-mono">ID: {{prod.id}}</span>
            <div class="flex space-x-2">
              <button (click)="edit(prod)" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
              <button (click)="delete(prod.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="products.length === 0" class="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
          <p class="text-gray-400">Empty product catalog. Start by adding one!</p>
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

  constructor(private supabase: SupabaseService) {}

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
    this.productForm = { ...prod };
    this.images = prod.product_images?.map((img: any) => img.image_url) || [];
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
        alert('Failed to upload one or more images');
      } finally {
        this.uploading = false;
      }
    }
  }

  removeImageSlot(index: number) {
    this.images.splice(index, 1);
  }

  async save() {
    let productId = this.editingProduct?.id;
    
    // 1. Save Product
    if (this.editingProduct) {
      await this.supabase.client.from('products').update(this.productForm).eq('id', productId);
    } else {
      const { data } = await this.supabase.client.from('products').insert([this.productForm]).select();
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
  }

  async delete(id: number) {
    if (confirm('Delete product?')) {
      await this.supabase.client.from('product_images').delete().eq('product_id', id);
      await this.supabase.client.from('products').delete().eq('id', id);
      this.load();
    }
  }
}
