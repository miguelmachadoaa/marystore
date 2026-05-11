import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { CartService } from '../../services/cart.service';

interface Stone {
  key: string;
  name: string;
  color: string;
  intent: string;
  chakra: string;
  benefit: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen site-bg">

      <!-- ── Navbar ── -->
      <nav class="sticky top-0 z-50 nav-glass border-b border-stone-petal">
        <div class="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="logo-title">Mary</span>
            <span class="logo-sub">Bienestar · Joyería</span>
          </div>
          <div class="flex items-center space-x-10">
            <a routerLink="/admin" class="nav-link">ESTUDIO</a>
            <a routerLink="/cart" class="relative group nav-link">
              BOLSA
              <span *ngIf="cartCount() > 0"
                class="absolute -top-3 -right-4 w-5 h-5 bg-gold text-white text-[9px] font-black flex items-center justify-center rounded-full">
                {{ cartCount() }}
              </span>
            </a>
          </div>
        </div>
      </nav>

      <!-- ── Hero ── -->
      <header class="hero-section pt-20 pb-28 px-10 overflow-hidden">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">

          <!-- Copy -->
          <div class="flex-1 space-y-8 relative z-10 animate-fade-in">
            <span class="eyebrow">Colección 2026 · Holística</span>
            <h1 class="hero-title">Cada piedra,<br>una intención.</h1>
            <p class="hero-sub">
              Pulseras artesanales creadas con piedras naturales seleccionadas por sus
              propiedades energéticas. Más que joyería — aliadas para tu bienestar.
            </p>

            <!-- Chakra pills -->
            <div class="flex flex-wrap gap-2 pt-2">
              <span *ngFor="let s of stones" class="chakra-pill"
                [style.border-color]="s.color + '55'"
                [style.color]="s.color">
                {{ s.name }}
              </span>
            </div>

            <button class="btn-hero" (click)="scrollToProducts()">
              Explorar Pulseras
            </button>
          </div>

          <!-- Visual -->
          <div class="flex-1 relative">
            <div class="hero-img-frame">
              <img
                src="https://ynabhdhwbozbieeardcu.supabase.co/storage/v1/object/public/marystore/0.03184236208777824.png"
                class="w-full h-full object-cover hero-img" alt="Pulseras con piedras naturales">
              <!-- Floating badge -->
              <div class="float-badge">
                <span class="float-badge-icon">✦</span>
                <span class="float-badge-text">100% Piedras Naturales</span>
              </div>
            </div>
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
          </div>
        </div>
      </header>

      <!-- ── Guía de Piedras ── -->
      <section class="max-w-7xl mx-auto px-10 py-20">
        <div class="section-header">
          <span class="eyebrow">Guía de Energías</span>
          <h2 class="section-title">Las piedras y sus poderes</h2>
          <p class="section-sub">
            Cada piedra lleva millones de años de energía de la tierra. Descubre cuál resuena con lo que necesitas hoy.
          </p>
        </div>

        <!-- Stone selector tabs -->
        <div class="stone-tabs">
          <button
            *ngFor="let s of stones"
            class="stone-tab"
            [class.active]="selectedStone()?.key === s.key"
            (click)="selectStone(s)">
            <span class="stone-tab-dot" [style.background]="s.color"></span>
            <span class="stone-tab-name">{{ s.name }}</span>
          </button>
        </div>

        <!-- Stone detail panel -->
        <div *ngIf="selectedStone()" class="stone-panel" [style.border-color]="selectedStone()!.color + '88'">
          <div class="stone-panel-left">
            <div class="stone-orb" [style.background]="selectedStone()!.color + '22'" [style.border-color]="selectedStone()!.color + '44'">
              <span class="stone-orb-glyph" [style.color]="selectedStone()!.color">◉</span>
            </div>
            <span class="stone-panel-name" [style.color]="selectedStone()!.color">{{ selectedStone()!.name }}</span>
            <span class="stone-panel-chakra">{{ selectedStone()!.chakra }}</span>
          </div>
          <div class="stone-panel-right">
            <p class="stone-panel-intent">{{ selectedStone()!.intent }}</p>
            <p class="stone-panel-benefit">{{ selectedStone()!.benefit }}</p>
            <div class="stone-panel-tags">
              <span *ngFor="let tag of getIntentTags(selectedStone()!.intent)"
                class="intent-tag"
                [style.background]="selectedStone()!.color + '18'"
                [style.color]="selectedStone()!.color">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Separador editorial ── -->
      <div class="editorial-divider max-w-7xl mx-auto px-10">
        <span class="editorial-line"></span>
        <span class="editorial-phrase">Curado con amor · Diseñado para el alma</span>
        <span class="editorial-line"></span>
      </div>

      <!-- ── Categorías ── -->
      <div class="max-w-7xl mx-auto px-10 py-8 flex space-x-10 overflow-x-auto scrollbar-hide border-b border-stone-petal">
        <button
          *ngFor="let cat of categories"
          class="cat-btn"
          [class.active]="selectedCategory() === cat"
          (click)="selectedCategory.set(cat)">
          {{ cat }}
        </button>
      </div>

      <!-- ── Grid de productos ── -->
      <main id="products" class="max-w-7xl mx-auto px-10 py-24">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          <div *ngFor="let prod of filteredProducts()" class="product-card group">

            <!-- Imagen -->
            <div [routerLink]="['/product', prod.slug]"
              class="prod-img-wrap cursor-pointer">
              <img
                [src]="prod.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=800'"
                class="prod-img"
                [alt]="prod.name">
              <div class="prod-img-overlay"></div>

              <!-- Stone chip sobre imagen -->
              <div *ngIf="prod.stone_name" class="prod-stone-chip" [style.border-color]="prod.stone_color + '88'">
                <span class="prod-stone-dot" [style.background]="prod.stone_color"></span>
                {{ prod.stone_name }}
              </div>

              <!-- CTA hover -->
              <div class="prod-quick-add">
                <button (click)="$event.stopPropagation(); addToCart(prod)"
                  class="prod-quick-btn">
                  Añadir Rápido
                </button>
              </div>
            </div>

            <!-- Info -->
            <div class="prod-info">
              <span class="prod-category">{{ prod.category?.name }}</span>
              <h3 class="prod-name">{{ prod.name }}</h3>

              <!-- Beneficio holístico -->
              <p *ngIf="prod.stone_benefit" class="prod-benefit-text">
                ✦ {{ prod.stone_benefit }}
              </p>

              <div class="prod-footer">
                <span class="prod-price">{{ prod.price | currency }}</span>
                <button (click)="addToCart(prod)" class="prod-add-icon" aria-label="Añadir al carrito">+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="filteredProducts().length === 0" class="empty-state">
          <span class="empty-glyph">◎</span>
          <p class="empty-title">La bóveda está vacía actualmente</p>
          <p class="empty-sub">Suscríbete para recibir notificaciones del próximo lanzamiento</p>
        </div>
      </main>

      <!-- ── Sección ritual / cuidado ── -->
      <section class="ritual-section px-10 py-24">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="ritual-card" *ngFor="let r of rituals">
            <span class="ritual-num">{{ r.num }}</span>
            <h3 class="ritual-title">{{ r.title }}</h3>
            <p class="ritual-body">{{ r.body }}</p>
          </div>
        </div>
      </section>

      <!-- ── Footer ── -->
      <footer class="footer-section px-10 py-28 border-t border-stone-petal">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div class="space-y-8">
            <div class="flex flex-col">
              <span class="logo-title text-4xl">Mary</span>
              <span class="logo-sub">Bienestar · Joyería</span>
            </div>
            <p class="footer-tagline">
              Piedras naturales seleccionadas con intención.<br>
              Cada pulsera es un portal a tu energía más auténtica.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-10">
            <div class="space-y-5">
              <h4 class="footer-heading">Explorar</h4>
              <ul class="footer-links">
                <li><a href="#" class="footer-link">Nuestra historia</a></li>
                <li><a href="#" class="footer-link">Guía de piedras</a></li>
                <li><a href="#" class="footer-link">Diseño personalizado</a></li>
                <li><a href="#" class="footer-link">Cuidado de pulseras</a></li>
              </ul>
            </div>
            <div class="space-y-5">
              <h4 class="footer-heading">Conexión</h4>
              <ul class="footer-links">
                <li><a href="#" class="footer-link">Instagram</a></li>
                <li><a href="#" class="footer-link">Diario del alma</a></li>
                <li><a href="#" class="footer-link">Talleres holísticos</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="max-w-7xl mx-auto pt-16 mt-16 border-t border-stone-petal flex justify-between items-center">
          <p class="footer-copy">© 2024 Mary · curado con amor y cristales</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    /* ── Tokens ── */
    :host {
      --gold: #C9A96E;
      --gold-light: #EDD9B4;
      --petal: #F9F0ED;
      --petal-dark: #F0E4DE;
      --ink: #1A1714;
      --muted: #8C7B72;
      --cream: #FDFAF8;
    }

    /* ── Base ── */
    .site-bg { background: var(--cream); font-family: 'Georgia', serif; }

    /* ── Navbar ── */
    .nav-glass { background: rgba(253,250,248,0.75); backdrop-filter: blur(20px); }
    .border-stone-petal { border-color: var(--petal-dark); }
    .logo-title { font-family: 'Georgia', serif; font-style: italic; font-weight: 900; font-size: 2rem; color: var(--ink); line-height: 1; letter-spacing: -0.02em; }
    .logo-sub { font-size: 9px; font-weight: 700; letter-spacing: 0.35em; color: var(--gold); text-transform: uppercase; margin-left: 2px; font-family: sans-serif; }
    .nav-link { font-size: 10px; font-weight: 800; letter-spacing: 0.25em; color: #6B5B52; font-family: sans-serif; text-transform: uppercase; text-decoration: none; transition: color 0.2s; }
    .nav-link:hover { color: var(--gold); }

    /* ── Hero ── */
    .hero-section { background: var(--cream); }
    .eyebrow { font-size: 10px; font-weight: 800; letter-spacing: 0.45em; color: var(--gold); text-transform: uppercase; font-family: sans-serif; }
    .hero-title { font-family: 'Georgia', serif; font-size: clamp(3rem, 7vw, 5.5rem); font-style: italic; font-weight: 900; color: var(--ink); line-height: 0.92; letter-spacing: -0.03em; }
    .hero-sub { font-size: 1rem; color: var(--muted); font-weight: 400; line-height: 1.75; max-width: 360px; font-family: sans-serif; }
    .chakra-pill { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; padding: 4px 12px; border: 1px solid; border-radius: 999px; font-family: sans-serif; transition: opacity 0.2s; }
    .btn-hero { display: inline-block; background: var(--ink); color: var(--cream); font-size: 10px; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; padding: 16px 36px; border-radius: 999px; border: none; cursor: pointer; font-family: sans-serif; transition: background 0.2s, transform 0.15s; }
    .btn-hero:hover { background: var(--gold); transform: translateY(-1px); }

    /* Hero image */
    .hero-img-frame { width: 100%; aspect-ratio: 4/5; background: var(--petal); border-radius: 3rem; overflow: hidden; position: relative; box-shadow: 0 40px 80px -20px rgba(26,23,20,0.12); }
    .hero-img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.9); transition: transform 1.2s ease; }
    .hero-img-frame:hover .hero-img { transform: scale(1.04); }
    .float-badge { position: absolute; bottom: 1.5rem; left: 1.5rem; background: rgba(253,250,248,0.92); backdrop-filter: blur(12px); border-radius: 999px; padding: 8px 16px; display: flex; align-items: center; gap: 8px; font-family: sans-serif; }
    .float-badge-icon { color: var(--gold); font-size: 14px; }
    .float-badge-text { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: var(--ink); text-transform: uppercase; }
    .orb { position: absolute; border-radius: 50%; filter: blur(50px); opacity: 0.4; pointer-events: none; }
    .orb-1 { width: 200px; height: 200px; background: #EDD9B4; bottom: -40px; left: -40px; }
    .orb-2 { width: 280px; height: 280px; background: #F0C4B8; top: -60px; right: -60px; }

    /* ── Section headers ── */
    .section-header { text-align: center; margin-bottom: 3rem; }
    .section-title { font-family: 'Georgia', serif; font-size: 2.25rem; font-style: italic; font-weight: 900; color: var(--ink); margin: 0.5rem 0; letter-spacing: -0.02em; }
    .section-sub { font-size: 0.95rem; color: var(--muted); max-width: 480px; margin: 0.5rem auto 0; line-height: 1.75; font-family: sans-serif; }

    /* ── Stone Tabs ── */
    .stone-tabs { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 1.5rem; }
    .stone-tab { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border: 1px solid var(--petal-dark); border-radius: 999px; background: white; cursor: pointer; transition: all 0.2s; font-family: sans-serif; }
    .stone-tab:hover { border-color: var(--gold-light); }
    .stone-tab.active { background: var(--ink); border-color: var(--ink); }
    .stone-tab.active .stone-tab-name { color: var(--cream); }
    .stone-tab-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .stone-tab-name { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); transition: color 0.2s; }

    /* ── Stone Panel ── */
    .stone-panel { display: flex; gap: 2.5rem; align-items: flex-start; background: white; border: 1.5px solid; border-radius: 1.5rem; padding: 2rem 2.5rem; animation: panelIn 0.3s ease; }
    @keyframes panelIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .stone-panel-left { display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 100px; }
    .stone-orb { width: 80px; height: 80px; border-radius: 50%; border: 1.5px solid; display: flex; align-items: center; justify-content: center; }
    .stone-orb-glyph { font-size: 2.5rem; }
    .stone-panel-name { font-family: 'Georgia', serif; font-size: 14px; font-weight: 700; font-style: italic; text-align: center; }
    .stone-panel-chakra { font-size: 9px; font-weight: 800; letter-spacing: 0.25em; color: var(--muted); text-transform: uppercase; text-align: center; font-family: sans-serif; }
    .stone-panel-right { flex: 1; }
    .stone-panel-intent { font-family: 'Georgia', serif; font-size: 1.2rem; font-style: italic; font-weight: 700; color: var(--ink); margin: 0 0 0.75rem; line-height: 1.4; }
    .stone-panel-benefit { font-size: 0.9rem; color: var(--muted); line-height: 1.8; margin: 0 0 1rem; font-family: sans-serif; }
    .stone-panel-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .intent-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; font-family: sans-serif; }

    /* ── Editorial divider ── */
    .editorial-divider { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem 0; }
    .editorial-line { flex: 1; height: 0.5px; background: var(--petal-dark); }
    .editorial-phrase { font-size: 10px; font-weight: 700; letter-spacing: 0.35em; color: var(--gold); text-transform: uppercase; white-space: nowrap; font-family: sans-serif; }

    /* ── Categories ── */
    .cat-btn { font-size: 10px; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; padding-bottom: 0.5rem; border-bottom: 2px solid transparent; white-space: nowrap; transition: all 0.2s; color: #B0A09A; background: none; border-top: none; border-left: none; border-right: none; cursor: pointer; font-family: sans-serif; }
    .cat-btn.active { color: var(--ink); border-bottom-color: var(--gold); }
    .cat-btn:hover:not(.active) { color: var(--muted); }
    .scrollbar-hide::-webkit-scrollbar { display: none; }

    /* ── Product cards ── */
    .product-card { display: flex; flex-direction: column; }
    .prod-img-wrap { position: relative; width: 100%; aspect-ratio: 3/4; background: var(--petal); border-radius: 2.5rem; overflow: hidden; margin-bottom: 1.25rem; transition: box-shadow 0.4s; }
    .prod-img-wrap:hover { box-shadow: 0 30px 60px -15px rgba(26,23,20,0.15); }
    .prod-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
    .prod-img-wrap:hover .prod-img { transform: scale(1.05); }
    .prod-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(26,23,20,0.08) 0%, transparent 50%); }
    .prod-stone-chip { position: absolute; top: 1rem; left: 1rem; display: flex; align-items: center; gap: 6px; background: rgba(253,250,248,0.92); backdrop-filter: blur(8px); border: 1px solid; border-radius: 999px; padding: 5px 12px; font-size: 9px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink); font-family: sans-serif; }
    .prod-stone-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .prod-quick-add { position: absolute; bottom: 1.25rem; left: 50%; transform: translateX(-50%) translateY(12px); opacity: 0; transition: all 0.35s ease; }
    .prod-img-wrap:hover .prod-quick-add { opacity: 1; transform: translateX(-50%) translateY(0); }
    .prod-quick-btn { background: white; color: var(--ink); border: none; border-radius: 999px; padding: 10px 24px; font-size: 9px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.2s; font-family: sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
    .prod-quick-btn:hover { background: var(--gold); color: white; }
    .prod-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .prod-category { font-size: 9px; font-weight: 800; letter-spacing: 0.35em; color: var(--gold); text-transform: uppercase; font-family: sans-serif; }
    .prod-name { font-family: 'Georgia', serif; font-size: 1.3rem; font-style: italic; font-weight: 900; color: var(--ink); margin: 0; }
    .prod-benefit-text { font-size: 11px; color: var(--muted); line-height: 1.5; font-family: sans-serif; margin: 2px 0 6px; }
    .prod-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
    .prod-price { font-size: 1rem; color: var(--muted); font-weight: 400; font-family: sans-serif; }
    .prod-add-icon { width: 32px; height: 32px; border-radius: 50%; background: var(--ink); color: white; border: none; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
    .prod-add-icon:hover { background: var(--gold); }

    /* ── Empty state ── */
    .empty-state { padding: 8rem 0; text-align: center; }
    .empty-glyph { font-size: 3rem; color: var(--gold-light); display: block; margin-bottom: 1.5rem; }
    .empty-title { font-family: 'Georgia', serif; font-style: italic; font-size: 1.1rem; color: var(--muted); }
    .empty-sub { font-size: 10px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: #C8B8B2; margin-top: 0.75rem; font-family: sans-serif; }

    /* ── Ritual section ── */
    .ritual-section { background: var(--ink); }
    .ritual-card { padding: 2.5rem 0; border-top: 0.5px solid rgba(255,255,255,0.1); }
    .ritual-num { font-size: 10px; font-weight: 800; letter-spacing: 0.4em; color: var(--gold); text-transform: uppercase; font-family: sans-serif; }
    .ritual-title { font-family: 'Georgia', serif; font-size: 1.4rem; font-style: italic; font-weight: 900; color: #FDFAF8; margin: 0.75rem 0 0.5rem; }
    .ritual-body { font-size: 0.875rem; color: rgba(253,250,248,0.55); line-height: 1.8; font-family: sans-serif; margin: 0; }

    /* ── Footer ── */
    .footer-section { background: var(--cream); }
    .footer-tagline { font-family: 'Georgia', serif; font-style: italic; font-size: 1rem; color: var(--muted); line-height: 1.8; }
    .footer-heading { font-size: 9px; font-weight: 900; letter-spacing: 0.35em; text-transform: uppercase; color: var(--ink); font-family: sans-serif; }
    .footer-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
    .footer-link { font-size: 0.875rem; color: var(--muted); text-decoration: none; font-family: sans-serif; transition: color 0.2s; }
    .footer-link:hover { color: var(--gold); }
    .footer-copy { font-size: 9px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: #C8B8B2; font-family: sans-serif; }

    /* ── Animation ── */
    .animate-fade-in { animation: fadeIn 0.8s ease forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  `],
})
export class Home implements OnInit {
  products = signal<any[]>([]);
  categories = ['Todos los Productos', 'Collares', 'Pulseras', 'Pendientes', 'Anillos'];

  selectedStone = signal<Stone | null>(null);
  selectedCategory = signal<string>('Todos los Productos');

  stones: Stone[] = [
    {
      key: 'amatista',
      name: 'Amatista',
      color: '#9B72CF',
      intent: 'Calma mental e intuición profunda',
      chakra: 'Chakra Corona · Tercer Ojo',
      benefit: 'La piedra de la tranquilidad por excelencia. La amatista trabaja con el chakra de la corona para reducir el estrés, calmar la mente hiperactiva y potenciar la intuición. Ideal para momentos de cambio o cuando buscas mayor claridad emocional. Sus cristales violetas han sido usados durante siglos como apoyo para la meditación y el descanso profundo.',
    },
    {
      key: 'cuarzo',
      name: 'Cuarzo Rosa',
      color: '#D4829A',
      intent: 'Amor propio, ternura y relaciones armoniosas',
      chakra: 'Chakra del Corazón',
      benefit: 'La piedra del amor incondicional. Emite una energía suave que promueve el amor propio, la aceptación y la sanación emocional. Trabaja directamente con el chakra del corazón para liberar heridas pasadas y abrir espacio a nuevas conexiones. Perfecta para llevar en períodos de autoconocimiento o cuando buscas atraer relaciones más sanas.',
    },
    {
      key: 'obsidiana',
      name: 'Obsidiana',
      color: '#4A4040',
      intent: 'Protección energética y arraigo',
      chakra: 'Chakra Raíz',
      benefit: 'Piedra volcánica de alta vibración protectora, formada del fuego mismo de la tierra. Actúa como escudo contra energías negativas y ayuda a conectar con el suelo bajo tus pies. Ideal para personas sensibles que absorben las emociones del entorno, o para quienes buscan estabilidad en momentos de incertidumbre.',
    },
    {
      key: 'turquesa',
      name: 'Turquesa',
      color: '#3AACA8',
      intent: 'Comunicación auténtica y serenidad',
      chakra: 'Chakra de la Garganta',
      benefit: 'Usada por civilizaciones ancestrales como talismán de sabiduría y protección. La turquesa estimula el chakra de la garganta, favoreciendo la comunicación honesta y la expresión creativa. Trae calma en situaciones de tensión y ayuda a encontrar las palabras correctas cuando más se necesitan.',
    },
    {
      key: 'citrino',
      name: 'Citrino',
      color: '#D4922A',
      intent: 'Abundancia, alegría y vitalidad',
      chakra: 'Chakra del Plexo Solar',
      benefit: 'Llamado la "piedra del sol", el citrino irradia energía positiva y trabaja con el chakra del plexo solar para estimular la confianza, la creatividad y la motivación. Una de las pocas piedras que no acumula energías negativas — siempre transmite luz. Excelente compañera para procesos de emprendimiento o reinvención personal.',
    },
  ];

  rituals = [
    {
      num: '01',
      title: 'Limpia tu piedra',
      body: 'Al recibir tu pulsera, ponla bajo la luz de la luna llena o pásala por humo de salvia. Así liberas cualquier energía acumulada y la preparas para recibir tus intenciones.',
    },
    {
      num: '02',
      title: 'Programa tu intención',
      body: 'Sostén la pulsera en tus manos, cierra los ojos y declara en voz alta o mentalmente qué deseas manifestar. La piedra amplifica aquello en lo que enfocas tu energía.',
    },
    {
      num: '03',
      title: 'Úsala con conciencia',
      body: 'Lleva tu pulsera como recordatorio de tu intención diaria. Cuando la toques, regresa al presente y reconecta con el propósito que le diste al recibirla.',
    },
  ];

  constructor(
    private supabase: SupabaseService,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    const { data } = await this.supabase.getProducts();


    this.products.set(data || []);

    // Pre-seleccionar primera piedra
    this.selectedStone.set(this.stones[0]);
  }

  selectStone(stone: Stone) {
    this.selectedStone.set(stone);
  }

  getIntentTags(intent: string): string[] {
    return intent.split('·').map(t => t.trim()).filter(Boolean);
  }

  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    const products = this.products();

    console.log('Filtrando productos por categoría:', cat);

    if (cat === 'Todos los Productos') {
      return products;
    }

    return products.filter(
      p => p.category?.name === cat
    );
  });

  addToCart(prod: any) {
    this.cartService.addToCart(prod);
  }

  cartCount() {
    return this.cartService.count();
  }

  scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

 

}