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

  async uploadImage(file: File, bucket: string = 'marystore') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }

  // AUTH
  async signIn(email: string) {
    // For simplicity, using magic link or password? 
    // The user didn't specify, so I'll implement password sign-in for now.
    // They can use magic link if they prefer.
    return await this.supabase.auth.signInWithPassword({ email, password: 'temporary-password' }); // Placeholders
  }

  // More standard email/password
  async signInWithEmail(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  getSession() {
    return this.supabase.auth.getSession();
  }

  getUser() {
    return this.supabase.auth.getUser();
  }

  onAuthStateChange(callback: any) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async getProductBySlug(slug: string) {
    return await this.supabase
      .from('products')
      .select('*, categories(*), product_images(*)')
      .eq('slug', slug)
      .single();
  }

  async createOrder(customerData: any, items: any[]) {
    // 1. Create or Find Customer
    const { data: customer, error: custError } = await this.supabase
      .from('customers')
      .insert([{ 
        first_name: customerData.firstName, 
        last_name: customerData.lastName, 
        email: customerData.email,
        phone: customerData.phone
      }])
      .select()
      .single();

    if (custError) throw custError;

    // 2. Create Order
    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .insert([{ 
        customer_id: customer.id, 
        status: 'pending' 
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Create Order Details
    const orderDetails = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: detailsError } = await this.supabase
      .from('order_details')
      .insert(orderDetails);

    if (detailsError) throw detailsError;

    return order;
  }
}
