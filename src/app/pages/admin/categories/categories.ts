import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { Category } from '../../../models/store.models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <div class="flex justify-between items-end mb-12">
        <div>
          <h1 class="text-4xl font-serif font-black text-gray-900 italic">Categorías</h1>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Organización de la colección</p>
        </div>
        <button (click)="isAdding = true" class="btn-primary px-8 py-3 uppercase tracking-widest text-[10px]">
          Nueva Categoría
        </button>
      </div>

      <!-- Add/Edit Form -->
      <div *ngIf="isAdding || editingCategory" class="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-2xl shadow-rose-100/20 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
        <h2 class="text-xl font-serif font-black text-gray-900 mb-8 italic uppercase tracking-tighter">{{editingCategory ? 'Editar' : 'Nueva'}} Categoría</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nombre</label>
            <input [(ngModel)]="categoryForm.name" type="text" class="w-full px-6 py-4 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all placeholder:text-gray-200 font-medium">
          </div>
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Slug</label>
            <input [(ngModel)]="categoryForm.slug" type="text" class="w-full px-6 py-4 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all placeholder:text-gray-200 font-medium">
          </div>
        </div>
        <div class="mt-10 flex justify-end space-x-6">
          <button (click)="cancel()" class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Cancelar</button>
          <button (click)="save()" class="btn-primary px-10 py-4 uppercase tracking-widest text-[10px]">
            Guardar Cambios
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-[2.5rem] shadow-sm border border-rose-50 overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-[#fcf9f8] border-b border-rose-50">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">ID</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Slug</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-rose-50">
            <tr *ngFor="let cat of categories" class="hover:bg-rose-50/20 transition-colors">
              <td class="px-8 py-6 text-xs font-black text-gray-300 uppercase">{{cat.id}}</td>
              <td class="px-8 py-6 font-serif font-black text-gray-900 text-lg italic">{{cat.name}}</td>
              <td class="px-8 py-6 text-[11px] font-medium text-gray-400 lowercase">{{cat.slug}}</td>
              <td class="px-8 py-6 text-right space-x-4">
                <button (click)="edit(cat)" class="text-[10px] font-black text-gold hover:underline uppercase tracking-widest">Editar</button>
                <button (click)="delete(cat.id)" class="text-[10px] font-black text-red-300 hover:text-red-500 uppercase tracking-widest">Eliminar</button>
              </td>
            </tr>
            <tr *ngIf="categories.length === 0">
               <td colspan="4" class="px-8 py-20 text-center">
                 <p class="text-sm font-serif italic text-gray-400 uppercase tracking-[0.3em]">No se encontraron categorías</p>
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: ``,
})
export class Categories implements OnInit {
  categories: Category[] = [];
  isAdding = false;
  editingCategory: Category | null = null;
  categoryForm = { name: '', slug: '' };

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    this.load();
  }

  async load() {
    const { data } = await this.supabase.getCategories();
    this.categories = data || [];
  }

  edit(cat: Category) {
    this.editingCategory = cat;
    this.categoryForm = { ...cat };
    this.isAdding = false;
  }

  cancel() {
    this.isAdding = false;
    this.editingCategory = null;
    this.categoryForm = { name: '', slug: '' };
  }

  async save() {
    if (this.editingCategory) {
      await this.supabase.client.from('categories').update(this.categoryForm).eq('id', this.editingCategory.id);
    } else {
      await this.supabase.client.from('categories').insert([this.categoryForm]);
    }
    this.cancel();
    this.load();
  }

  async delete(id: number) {
    if (confirm('¿Estás segura de que quieres eliminar esta categoría?')) {
      await this.supabase.client.from('categories').delete().eq('id', id);
      this.load();
    }
  }
}
