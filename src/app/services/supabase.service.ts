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
      .select('*, category:categories(*), images:product_images(*)');
  }

  // Obtener materiales
  async getMaterials() {
    return this.client.from('materials').select('*');
  }

  // Obtener productos con TODO (incluyendo materiales)
  async getProductsFull() {
    return this.client
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        materials:product_materials(
          material:materials(*)
        )
      `);
  }

  // Guardar materiales de producto
  async saveProductMaterials(productId: string, materialIds: string[]) {
    // eliminar anteriores
    await this.client
      .from('product_materials')
      .delete()
      .eq('product_id', productId);

    // insertar nuevas
    const relations = materialIds.map(id => ({
      product_id: productId,
      material_id: id
    }));

    if (relations.length > 0) {
      await this.client.from('product_materials').insert(relations);
    }
  }

  // Productos relacionados
  async getRelatedProducts(materialIds: number[], currentId: number) {
    return this.client
      .from('product_materials')
      .select(`
      product:products(
        id,
        name,
        price,
        slug,
        images:product_images(*),
        materials:product_materials(
          material:materials(*)
        )
      )
    `)
      .in('material_id', materialIds)
      .neq('product_id', currentId)
      .limit(8);
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
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        materials:product_materials(
          material:materials(*)
        )
      `)
      .eq('slug', slug)
      .single();
  }

  async createOrder(customerData: any, items: any[]) {
    // 1. Buscar customer por email
    let { data: customer, error: findError } = await this.supabase
      .from('customers')
      .select()
      .eq('email', customerData.email)
      .maybeSingle();

    if (findError) throw findError;

    // 2. Si no existe, crearlo
    if (!customer) {
      const { data: newCustomer, error: custError } = await this.supabase
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
      customer = newCustomer;
    }

    // 3. Crear Order
    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .insert([{
        customer_id: customer.id,
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Crear Order Details
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

    // 5. Enviar email
    await this.sendOrderEmail(customer, order, items);

    return order;
  }

  private async sendOrderEmail(customer: any, order: any, items: any[]) {
    const { error } = await this.supabase.functions.invoke('mailtrap-email', {
      body: {
        customerEmail: customer.email,
        customerName: `${customer.first_name} ${customer.last_name}`,
        order,
        items,
      },
    });

    if (error) {
      console.error('Error enviando email:', error);
    }
  }

  // ORDERS
  async getOrders() {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        customers (first_name, last_name, email)
      `)
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return { data: [], error };
    }
    console.log(data);
    return { data, error: null };
  }

  async getOrderById(id: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        customers (*),
        order_details (
          *,
          products (
            *,
            product_images (*)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order by ID:', error);
      return { data: null, error };
    }
    return { data, error: null };
  }
}
