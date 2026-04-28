export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Material {
  id: string;
  name: string;
  slug: string;
}

export interface ProductMaterial {
  material: Material;
}


export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  slug: string;
  category?: Category;
  images?: ProductImage[];
  materials?: ProductMaterial[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: number;
  customer_id: number;
  order_date: string;
  status: string;
  customer?: Customer;
  details?: OrderDetail[];
}

export interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface User {
  id: number;
  username: string;
  role: string;
}
