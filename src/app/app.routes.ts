import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AdminLayout } from './pages/admin/admin-layout';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { Categories } from './pages/admin/categories/categories';
import { Products } from './pages/admin/products/products';
import { Login } from './pages/login/login';
import { AuthGuard } from './guards/auth.guard';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Thanks } from './pages/thanks/thanks';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'product/:slug', component: ProductDetail },
  { path: 'cart', component: Cart },
  { path: 'thanks', component: Thanks },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'categories', component: Categories },
      { path: 'products', component: Products },
    ],
  },
];
