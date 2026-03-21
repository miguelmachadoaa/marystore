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
    <div class="min-h-screen bg-[#fcf9f8] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')]">
      <div class="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-rose-100">
        <div class="p-12">
          <div class="text-center mb-12">
            <div class="flex flex-col items-center mb-6">
              <span class="text-4xl font-serif font-black italic text-gray-900 leading-none">Mary</span>
              <span class="text-[12px] font-bold tracking-[0.4em] text-gold uppercase">Boutique</span>
            </div>
            <h2 class="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Acceso de Estudio</h2>
          </div>

          <form (submit)="login($event)" class="space-y-8">
            <div class="space-y-3">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Correo Electrónico</label>
              <input [(ngModel)]="email" name="email" type="email" required 
                class="w-full px-8 py-4 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all placeholder:text-gray-200 font-medium"
                placeholder="admin@maryboutique.com">
            </div>

            <div class="space-y-3">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Contraseña</label>
              <input [(ngModel)]="password" name="password" type="password" required 
                class="w-full px-8 py-4 rounded-2xl bg-[#fcf9f8] border border-rose-50 focus:bg-white focus:border-gold outline-none transition-all placeholder:text-gray-200 font-medium"
                placeholder="••••••••">
            </div>

            <div *ngIf="error" class="bg-rose-50 text-gold p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-fade-in">
              {{ error === 'Invalid login credentials' ? 'Credenciales Inválidas' : error }}
            </div>

            <button type="submit" [disabled]="loading" 
              class="w-full btn-primary py-5 rounded-2xl uppercase tracking-[0.3em] text-xs shadow-xl shadow-gold/10">
              {{ loading ? 'ENTRANDO...' : 'INICIAR SESIÓN' }}
            </button>
          </form>

          <div class="mt-12 text-center pt-8 border-t border-rose-50">
             <a routerLink="/" class="text-gray-400 hover:text-gold font-bold text-[10px] uppercase tracking-widest transition-all inline-flex items-center space-x-3">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
               <span>Volver a la Boutique</span>
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
