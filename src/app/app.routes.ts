import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { Categories } from './pages/admin/categories/categories';
import { Products } from './pages/admin/products/products';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'admin',
    children: [
      { path: '', component: Dashboard },
      { path: 'categories', component: Categories },
      { path: 'products', component: Products },
    ],
  },
];
