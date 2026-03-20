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
    <div class="p-6 max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Manage Categories</h1>
        <button (click)="isAdding = true" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Add Category
        </button>
      </div>

      <!-- Add/Edit Form -->
      <div *ngIf="isAdding || editingCategory" class="bg-white p-6 rounded-xl shadow-sm border mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
        <h2 class="text-xl font-semibold mb-4">{{editingCategory ? 'Edit' : 'New'}} Category</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input [(ngModel)]="categoryForm.name" type="text" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input [(ngModel)]="categoryForm.slug" type="text" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none">
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button (click)="cancel()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button (click)="save()" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm">
            Save Category
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b">
              <th class="px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-600">Slug</th>
              <th class="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cat of categories" class="border-b last:border-0 hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-sm text-gray-500">{{cat.id}}</td>
              <td class="px-6 py-4 font-medium text-gray-900">{{cat.name}}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{cat.slug}}</td>
              <td class="px-6 py-4 text-right space-x-2">
                <button (click)="edit(cat)" class="text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-md text-sm font-medium">Edit</button>
                <button (click)="delete(cat.id)" class="text-red-600 hover:bg-red-50 px-3 py-1 rounded-md text-sm font-medium">Delete</button>
              </td>
            </tr>
            <tr *ngIf="categories.length === 0">
               <td colspan="4" class="px-6 py-10 text-center text-gray-500">No categories found.</td>
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
    if (confirm('Are you sure you want to delete this category?')) {
      await this.supabase.client.from('categories').delete().eq('id', id);
      this.load();
    }
  }
}
