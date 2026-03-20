import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get client() {
    return this.supabase;
  }

  // Categories
  async getCategories() {
    return await this.supabase.from('categories').select('*');
  }

  // Products with Categories and Images
  async getProducts() {
    return await this.supabase
      .from('products')
      .select('*, categories(*), product_images(*)');
  }

  // Generic CRUD helpers could be added here
}
