import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const { data } = await this.supabase.getSession();
    if (data.session) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
