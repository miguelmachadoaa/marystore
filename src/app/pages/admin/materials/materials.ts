import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
    selector: 'app-materials',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-8 max-w-5xl mx-auto">
      <div class="flex justify-between items-end mb-12">
        <div>
          <h1 class="text-4xl font-serif font-black text-gray-900 italic">Materiales</h1>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">
            Composición de las joyas
          </p>
        </div>

        <button (click)="isAdding = true"
          class="btn-primary px-8 py-3 uppercase tracking-widest text-[10px]">
          Nuevo Material
        </button>
      </div>

      <!-- FORM -->
      <div *ngIf="isAdding || editing"
        class="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-2xl mb-12">

        <h2 class="text-xl font-serif font-black mb-8 italic uppercase">
          {{ editing ? 'Editar' : 'Nuevo' }} Material
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <input [(ngModel)]="form.name" (input)="onNameChange()" placeholder="Nombre"
  class="px-6 py-4 rounded-2xl border" />

          <input [(ngModel)]="form.slug" placeholder="Slug"
            class="px-6 py-4 rounded-2xl border" />
        </div>

        <div class="mt-10 flex justify-end space-x-6">
          <button (click)="cancel()">Cancelar</button>
          <button (click)="save()" class="btn-primary px-8 py-3">
            Guardar
          </button>
        </div>
      </div>

      <!-- TABLE -->
      <div class="bg-white rounded-3xl border overflow-hidden">
        <table class="w-full">
          <thead>
            <tr>
              <th class="p-4">ID</th>
              <th class="p-4">Nombre</th>
              <th class="p-4">Slug</th>
              <th class="p-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let m of materials">
              <td class="p-4">{{m.id}}</td>
              <td class="p-4">{{m.name}}</td>
              <td class="p-4">{{m.slug}}</td>

              <td class="p-4 text-right space-x-4">
                <button (click)="edit(m)">Editar</button>
                <button (click)="delete(m.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class Materials implements OnInit {

    materials: any[] = [];
    isAdding = false;
    editing: any = null;

    form = {
        name: '',
        slug: ''
    };

    constructor(private supabase: SupabaseService) { }

    async ngOnInit() {
        this.load();
    }

    async load() {
        const { data } = await this.supabase.client
            .from('materials')
            .select('*');

        this.materials = data || [];
    }

    edit(m: any) {
        this.editing = m;
        this.form = { ...m };
        this.isAdding = false;
    }

    cancel() {
        this.editing = null;
        this.isAdding = false;
        this.form = { name: '', slug: '' };
    }

    async save() {
        try {
            let finalSlug = this.form.slug || this.generateSlug(this.form.name);
            let isUnique = false;
            let counter = 0;
            let currentSlug = finalSlug;

            while (!isUnique) {
                const { data: existing } = await this.supabase.client
                    .from('materials')
                    .select('id')
                    .eq('slug', currentSlug)
                    .neq('id', this.editing?.id || -1)
                    .maybeSingle();

                if (existing) {
                    counter++;
                    currentSlug = `${finalSlug}-${counter}`;
                } else {
                    isUnique = true;
                    this.form.slug = currentSlug;
                }
            }

            if (this.editing) {
                await this.supabase.client
                    .from('materials')
                    .update(this.form)
                    .eq('id', this.editing.id);
            } else {
                await this.supabase.client
                    .from('materials')
                    .insert([this.form]);
            }

            this.cancel();
            this.load();

        } catch (e) {
            console.error(e);
            alert('Error al guardar material');
        }
    }

    async delete(id: number) {
        if (confirm('¿Eliminar material?')) {
            await this.supabase.client
                .from('materials')
                .delete()
                .eq('id', id);

            this.load();
        }
    }

    onNameChange() {
        if (!this.editing) {
            this.form.slug = this.generateSlug(this.form.name);
        }
    }

    generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // quitar acentos
            .replace(/[^a-z0-9\s-]/g, '')   // quitar símbolos
            .replace(/\s+/g, '-')           // espacios a -
            .replace(/-+/g, '-');           // evitar --
    }
}