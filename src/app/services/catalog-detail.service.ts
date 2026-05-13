import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import jsPDF from 'jspdf';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  slug: string;
  category?: { name: string };
  images?: { image_url: string }[];
  materials?: { name: string }[];
}

// ─── Colores de marca ────────────────────────────────────────────────────────
const C = {
  cream:     [253, 250, 248] as [number, number, number],
  petal:     [240, 228, 222] as [number, number, number],
  ink:       [ 26,  23,  20] as [number, number, number],
  gold:      [201, 169, 110] as [number, number, number],
  goldLight: [237, 217, 180] as [number, number, number],
  muted:     [140, 123, 114] as [number, number, number],
  white:     [255, 255, 255] as [number, number, number],
};

@Injectable({ providedIn: 'root' })
export class CatalogDetailService {

  private supabase = inject(SupabaseService);

  async generateCatalog(): Promise<void> {
    const products = await this.fetchProducts();
    const doc      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    this.buildCoverPage(doc);

    for (let i = 0; i < products.length; i++) {
      doc.addPage();
      await this.buildProductPage(doc, products[i], i + 1, products.length);
    }

    this.buildBackPage(doc);
    doc.save('mary-catalogo-detalle-2026.pdf');
  }

  // ── Fetch de Supabase ─────────────────────────────────────────────────────
  private async fetchProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase.client
      .from('products')
      .select(`
        id, name, description, price, slug,
        category:categories(name),
        images:product_images(image_url),
        materials:product_materials(material:materials(name))
      `)
      .order('id');

    if (error) {
      console.error('Error cargando productos:', error);
      return [];
    }

    return (data || []).map((p: any) => ({
      ...p,
      materials: (p.materials || []).map((m: any) => m.material ?? m),
    }));
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  PORTADA
  // ══════════════════════════════════════════════════════════════════════════
  private buildCoverPage(doc: jsPDF): void {
    const W = 210, H = 297;

    doc.setFillColor(...C.cream);
    doc.rect(0, 0, W, H, 'F');
    doc.setFillColor(...C.goldLight);
    doc.rect(0, 0, W, 3, 'F');
    doc.setFillColor(...C.ink);
    doc.rect(0, 0, 72, H, 'F');
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.3);
    doc.line(68, 20, 68, H - 20);

    doc.setTextColor(...C.cream);
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(52);
    doc.text('Mary', 48, H / 2 + 40, { align: 'center', angle: 90 });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setCharSpace(4);
    doc.setTextColor(...C.gold);
    doc.text('BIENESTAR · JOYERÍA', 20, H / 2 + 20, { align: 'center', angle: 90 });
    doc.setCharSpace(0);

    const rx = 85;
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setCharSpace(3.5);
    doc.text('CATÁLOGO DETALLE 2026', rx, 60);
    doc.setCharSpace(0);

    doc.setTextColor(...C.ink);
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(38);
    doc.text('Cada piedra,', rx, 85);
    doc.text('una intención.', rx, 103);

    doc.setDrawColor(...C.gold);
    doc.setLineWidth(1.2);
    doc.line(rx, 110, rx + 90, 110);

    doc.setTextColor(...C.muted);
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    ['Una mirada íntima a cada pieza artesanal,',
     'sus piedras, sus propiedades energéticas',
     'y la intención detrás de cada diseño.',
    ].forEach((line, i) => doc.text(line, rx, 122 + i * 7));

    doc.setTextColor(...C.goldLight);
    doc.setFont('times', 'bold');
    doc.setFontSize(80);
    doc.text('✦', rx + 58, 200, { align: 'center' });

    doc.setFillColor(...C.gold);
    doc.rect(72, H - 18, W - 72, 18, 'F');
    doc.setTextColor(...C.cream);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setCharSpace(3);
    doc.text('CURADO CON AMOR · DISEÑADO PARA EL ALMA', W / 2 + 36, H - 7, { align: 'center' });
    doc.setCharSpace(0);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  PÁGINA DE UN PRODUCTO
  // ══════════════════════════════════════════════════════════════════════════
  private async buildProductPage(doc: jsPDF, product: Product, index: number, total: number): Promise<void> {
    const W = 210, H = 297;

    // Fondo
    doc.setFillColor(...C.cream);
    doc.rect(0, 0, W, H, 'F');

    // Franja lateral izquierda con color de categoría
    const catColor = this.getCategoryColor(product.category?.name);
    doc.setFillColor(...catColor);
    doc.rect(0, 0, 6, H, 'F');

    // Decoración esquinas
    this.drawCornerAccents(doc);

    // ── Header ────────────────────────────────────────────────────────────
    doc.setDrawColor(...C.goldLight);
    doc.setLineWidth(0.4);
    doc.line(14, 20, W - 14, 20);

    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setCharSpace(3);
    doc.text('MARY · CATÁLOGO DETALLE 2026', 14, 17);
    doc.setCharSpace(0);

    doc.setTextColor(...C.muted);
    doc.setFontSize(6.5);
    doc.text(`${index} de ${total}`, W - 14, 17, { align: 'right' });

    // ── Zona superior: Imagen principal grande + galería ──────────────────
    const mainImgX = 14;
    const mainImgY = 26;
    const mainImgW = W - 28;   // ancho completo entre márgenes
    const mainImgH = 120;

    // Fondo imagen principal
    doc.setFillColor(...C.petal);
    doc.roundedRect(mainImgX, mainImgY, mainImgW, mainImgH, 4, 4, 'F');

    const mainUrl = product.images?.[0]?.image_url;
    if (mainUrl) {
      try {
        const imgData = await this.loadImageAsBase64(mainUrl);
        doc.addImage(imgData, 'JPEG', mainImgX, mainImgY, mainImgW, mainImgH, '', 'FAST');
      } catch {
        this.drawImagePlaceholder(doc, mainImgX, mainImgY, mainImgW, mainImgH, 22);
      }
    } else {
      this.drawImagePlaceholder(doc, mainImgX, mainImgY, mainImgW, mainImgH, 22);
    }


    // ── Zona de texto ────────────────────────────────────────────────────
    const textY = mainImgY + mainImgH + 10;
    const textX = 14;
    const textW = W - 28;

    // Categoría
    doc.setTextColor(...catColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setCharSpace(3);
    doc.text((product.category?.name || 'Joyería').toUpperCase(), textX, textY);
    doc.setCharSpace(0);

    // Nombre grande
    doc.setTextColor(...C.ink);
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(28);
    const nameLines = doc.splitTextToSize(product.name, textW);
    doc.text(nameLines.slice(0, 2), textX, textY + 9);

    // Línea dorada
    const afterName = textY + 9 + Math.min(nameLines.length, 2) * 10;
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.8);
    doc.line(textX, afterName, textX + 60, afterName);

    // Precio destacado
    doc.setTextColor(...C.gold);
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.text(`$${product.price.toFixed(2)}`, W - 14, afterName, { align: 'right' });

    // Línea separadora precio
    doc.setDrawColor(...C.goldLight);
    doc.setLineWidth(0.3);
    doc.line(W - 60, afterName, W - 14, afterName);

    // Descripción
    const descY = afterName + 8;
    doc.setTextColor(...C.muted);
    doc.setFont('times', 'italic');
    doc.setFontSize(9.5);
    const descText  = product.description || 'Pieza artesanal con piedras naturales seleccionadas con intención.';
    const descLines = doc.splitTextToSize(descText, textW);
    doc.text(descLines.slice(0, 5), textX, descY);

    // ── Bloque de materiales ──────────────────────────────────────────────
    const matsY = descY + Math.min(descLines.length, 5) * 5 + 8;

    if (product.materials?.length) {
      // Título sección
      doc.setTextColor(...C.ink);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setCharSpace(2.5);
      doc.text('PIEDRAS & MATERIALES', textX, matsY);
      doc.setCharSpace(0);

      // Pills de materiales
      const stoneColors: [number, number, number][] = [
        [155, 114, 207], [212, 130, 154], [74,  64,  64],
        [ 58, 172, 168], [212, 146,  42], [100, 140, 200],
      ];

      let pillX = textX;
      const pillY = matsY + 5;

      product.materials.forEach((m: any, idx: number) => {
        const label   = m.name.toUpperCase();
        const color   = stoneColors[idx % stoneColors.length];
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        const labelW  = doc.getTextWidth(label);
        const pillW   = labelW + 10;
        const pillH   = 6;

        // Si se sale del margen, saltar línea
        if (pillX + pillW > W - 14) {
          pillX = textX;
        }

        doc.setFillColor(...color);
        doc.roundedRect(pillX, pillY - 4, pillW, pillH, 3, 3, 'F');
        doc.setTextColor(...C.white);
        doc.setCharSpace(0.5);
        doc.text(label, pillX + 5, pillY + 0.5);
        doc.setCharSpace(0);

        pillX += pillW + 3;
      });
    }

    // ── Footer ────────────────────────────────────────────────────────────
    doc.setDrawColor(...C.goldLight);
    doc.setLineWidth(0.4);
    doc.line(14, H - 18, W - 14, H - 18);

    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text('© 2026 Mary · Curado con amor y cristales', 14, H - 12);
    doc.text(`${index}`, W - 14, H - 12, { align: 'right' });

    doc.setFillColor(...C.gold);
    doc.circle(W / 2, H - 13, 1, 'F');
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  CONTRAPORTADA
  // ══════════════════════════════════════════════════════════════════════════
  private buildBackPage(doc: jsPDF): void {
    const W = 210, H = 297;

    doc.setFillColor(...C.ink);
    doc.rect(0, 0, W, H, 'F');

    doc.setFillColor(40, 36, 33);
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 18; col++) {
        if ((row + col) % 3 === 0) {
          doc.circle(col * 12 + 6, row * 25 + 10, 0.8, 'F');
        }
      }
    }

    doc.setTextColor(...C.cream);
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(72);
    doc.text('Mary', W / 2, H / 2 - 30, { align: 'center' });

    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setCharSpace(4);
    doc.text('BIENESTAR · JOYERÍA', W / 2, H / 2 - 10, { align: 'center' });
    doc.setCharSpace(0);

    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.8);
    doc.line(W / 2 - 40, H / 2 - 4, W / 2 + 40, H / 2 - 4);

    doc.setTextColor(...C.cream);
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.text('Piedras naturales seleccionadas con intención.', W / 2, H / 2 + 8, { align: 'center' });
    doc.text('Cada pulsera es un portal a tu energía más auténtica.', W / 2, H / 2 + 17, { align: 'center' });

    const stones: { name: string; color: [number, number, number] }[] = [
      { name: 'Amatista',  color: [155, 114, 207] },
      { name: 'Cuarzo',    color: [212, 130, 154] },
      { name: 'Obsidiana', color: [120, 108, 100] },
      { name: 'Turquesa',  color: [ 58, 172, 168] },
      { name: 'Citrino',   color: [212, 146,  42] },
    ];
    const startX = W / 2 - (stones.length - 1) * 18;
    stones.forEach((s, i) => {
      const x = startX + i * 36;
      doc.setFillColor(...s.color);
      doc.circle(x, H / 2 + 36, 5, 'F');
      doc.setTextColor(...s.color);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setCharSpace(0.5);
      doc.text(s.name.toUpperCase(), x, H / 2 + 46, { align: 'center' });
      doc.setCharSpace(0);
    });

    const rituals = [
      { num: '01', title: 'Limpia tu piedra' },
      { num: '02', title: 'Programa tu intención' },
      { num: '03', title: 'Úsala con conciencia' },
    ];
    rituals.forEach((r, i) => {
      const rx = 25 + i * 63;
      doc.setDrawColor(...C.gold);
      doc.setLineWidth(0.3);
      doc.line(rx, H / 2 + 64, rx + 50, H / 2 + 64);
      doc.setTextColor(...C.gold);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setCharSpace(1.5);
      doc.text(r.num, rx, H / 2 + 68);
      doc.setCharSpace(0);
      doc.setTextColor(...C.cream);
      doc.setFont('times', 'italic');
      doc.setFontSize(9);
      doc.text(r.title, rx, H / 2 + 75);
    });

    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setCharSpace(2);
    doc.text('© 2026 MARY · CURADO CON AMOR Y CRISTALES', W / 2, H - 15, { align: 'center' });
    doc.setCharSpace(0);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════════════

  private drawCornerAccents(doc: jsPDF): void {
    const W = 210, H = 297;
    const corners: [number, number][] = [[8,8],[202,8],[8,289],[202,289]];
    const dirs:    [number, number][] = [[1,1],[-1,1],[1,-1],[-1,-1]];
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.6);
    corners.forEach(([cx, cy], k) => {
      const [dx, dy] = dirs[k];
      doc.line(cx, cy, cx + dx * 8, cy);
      doc.line(cx, cy, cx, cy + dy * 8);
    });
  }

  private drawImagePlaceholder(doc: jsPDF, x: number, y: number, w: number, h: number, fontSize = 28): void {
    doc.setFillColor(...C.petal);
    doc.roundedRect(x, y, w, h, 3, 3, 'F');
    doc.setTextColor(...C.gold);
    doc.setFont('times', 'bold');
    doc.setFontSize(fontSize);
    doc.text('◉', x + w / 2, y + h / 2 + fontSize * 0.14, { align: 'center' });
    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text('IMAGEN', x + w / 2, y + h / 2 + fontSize * 0.14 + 7, { align: 'center' });
  }

  private loadImageAsBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = url.includes('?') ? url : `${url}?t=${Date.now()}`;
    });
  }

  /** Carga la imagen y la recorta al centro en un cuadrado perfecto */
  private loadImageAsBase64CropSquare(url: string, _sizeMm: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const side   = Math.min(img.naturalWidth, img.naturalHeight);
        const sx     = Math.floor((img.naturalWidth  - side) / 2);
        const sy     = Math.floor((img.naturalHeight - side) / 2);
        const canvas = document.createElement('canvas');
        // Renderizar a resolución fija alta para buena calidad en PDF
        const px = 400;
        canvas.width  = px;
        canvas.height = px;
        canvas.getContext('2d')!.drawImage(img, sx, sy, side, side, 0, 0, px, px);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = url.includes('?') ? url : `${url}?t=${Date.now()}`;
    });
  }

  private getCategoryColor(categoryName?: string): [number, number, number] {
    const map: Record<string, [number, number, number]> = {
      'Pulseras':   [155, 114, 207],
      'Collares':   [212, 130, 154],
      'Pendientes': [ 58, 172, 168],
      'Anillos':    [212, 146,  42],
    };
    return map[categoryName ?? ''] ?? C.gold;
  }
}