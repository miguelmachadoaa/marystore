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
  cream:      [253, 250, 248] as [number, number, number],
  petal:      [240, 228, 222] as [number, number, number],
  ink:        [ 26,  23,  20] as [number, number, number],
  gold:       [201, 169, 110] as [number, number, number],
  goldLight:  [237, 217, 180] as [number, number, number],
  muted:      [140, 123, 114] as [number, number, number],
  white:      [255, 255, 255] as [number, number, number],
};

@Injectable({ providedIn: 'root' })
export class CatalogService {

  // ✅ Fix NG2003: inject() en lugar del constructor
  private supabase = inject(SupabaseService);

  async generateCatalog(): Promise<void> {
    const products = await this.fetchProducts();
    const doc      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    this.buildCoverPage(doc);
    await this.buildProductPages(doc, products);
    this.buildBackPage(doc);

    doc.save('mary-catalogo-2026.pdf');
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
    doc.text('COLECCIÓN 2026 · HOLÍSTICA', rx, 60);
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
    ['Pulseras artesanales creadas con piedras',
     'naturales seleccionadas por sus propiedades',
     'energéticas. Más que joyería — aliadas',
     'para tu bienestar.',
    ].forEach((line, i) => doc.text(line, rx, 122 + i * 7));

    doc.setTextColor(...C.goldLight);
    doc.setFont('times', 'bold');
    doc.setFontSize(80);
    doc.text('✦', rx + 58, 200, { align: 'center' });

    this.drawBadge(doc, rx, 220, '100% Piedras Naturales');

    const stones = ['Amatista', 'Cuarzo Rosa', 'Obsidiana', 'Turquesa', 'Citrino'];
    const stoneColors: [number, number, number][] = [
      [155, 114, 207], [212, 130, 154], [74, 64, 64], [58, 172, 168], [212, 146, 42],
    ];
    stones.forEach((s, i) => {
      const x = rx + i * 24;
      doc.setFillColor(...stoneColors[i]);
      doc.circle(x + 4, 238, 2, 'F');
      doc.setTextColor(...stoneColors[i]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setCharSpace(0.8);
      doc.text(s.toUpperCase(), x, 244);
      doc.setCharSpace(0);
    });

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
  //  PÁGINAS DE PRODUCTOS
  // ══════════════════════════════════════════════════════════════════════════
  private async buildProductPages(doc: jsPDF, products: Product[]): Promise<void> {
    for (let i = 0; i < products.length; i += 4) {
      doc.addPage();
      this.drawPageBackground(doc);
      this.drawPageHeader(doc, i, products.length);

      for (let j = 0; j < 4 && i + j < products.length; j++) {
        await this.drawProductCard(doc, products[i + j], j);
      }

      this.drawPageFooter(doc, Math.floor(i / 4) + 2);
    }
  }

  private drawPageBackground(doc: jsPDF): void {
    const W = 210, H = 297;
    doc.setFillColor(...C.cream);
    doc.rect(0, 0, W, H, 'F');
    doc.setDrawColor(...C.petal);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, W - 16, H - 16);

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

  private drawPageHeader(doc: jsPDF, startIdx: number, total: number): void {
    doc.setDrawColor(...C.goldLight);
    doc.setLineWidth(0.4);
    doc.line(14, 20, 196, 20);

    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setCharSpace(3);
    doc.text('MARY · JOYERÍA & BIENESTAR', 14, 17);
    doc.setCharSpace(0);

    doc.setTextColor(...C.muted);
    doc.setFontSize(6.5);
    doc.text(`${startIdx + 1}–${Math.min(startIdx + 4, total)} de ${total} piezas`, 196, 17, { align: 'right' });
  }

  private async drawProductCard(doc: jsPDF, product: Product, position: number): Promise<void> {
    const W      = 210;
    // 4 cards por página: header ~22mm + footer ~18mm = 40mm usados
    // espacio disponible: 297 - 40 = 257mm / 4 cards = ~62mm por card con gaps
    const cardH  = 60;
    const gap    = 3;
    const cardY  = 23 + position * (cardH + gap);
    const margin = 12;
    const imgW   = 38;
    const imgH   = 50;
    const imgX   = margin + 2;
    const imgY   = cardY + (cardH - imgH) / 2;
    const textX  = imgX + imgW + 8;
    const textW  = W - textX - margin - 4;

    // Sombra / fondo de card
    doc.setFillColor(245, 242, 240);
    doc.roundedRect(margin - 1, cardY - 1, W - 2 * margin + 2, cardH + 2, 3, 3, 'F');
    doc.setFillColor(...C.white);
    doc.roundedRect(margin, cardY, W - 2 * margin, cardH, 2.5, 2.5, 'F');

    // Borde izquierdo de color por categoría
    const catColor = this.getCategoryColor(product.category?.name);
    doc.setFillColor(...catColor);
    doc.roundedRect(margin, cardY, 2.5, cardH, 1.5, 1.5, 'F');

    // Imagen
    const imageUrl = product.images?.[0]?.image_url;
    if (imageUrl) {
      try {
        const imgData = await this.loadImageAsBase64(imageUrl);
        doc.setFillColor(...C.petal);
        doc.roundedRect(imgX, imgY, imgW, imgH, 2.5, 2.5, 'F');
        doc.addImage(imgData, 'JPEG', imgX, imgY, imgW, imgH, '', 'FAST');
      } catch {
        this.drawImagePlaceholder(doc, imgX, imgY, imgW, imgH);
      }
    } else {
      this.drawImagePlaceholder(doc, imgX, imgY, imgW, imgH);
    }

    // ── Texto ──
    const ty = cardY + 9;

    // Categoría
    doc.setTextColor(...catColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setCharSpace(2);
    doc.text((product.category?.name || 'Joyería').toUpperCase(), textX, ty);
    doc.setCharSpace(0);

    // Nombre del producto
    doc.setTextColor(...C.ink);
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(13);
    const nameLines = doc.splitTextToSize(product.name, textW);
    doc.text(nameLines.slice(0, 2), textX, ty + 7);

    // Línea dorada bajo el nombre
    const nameLineY = ty + 7 + Math.min(nameLines.length, 2) * 5.5;
    doc.setDrawColor(...C.goldLight);
    doc.setLineWidth(0.4);
    doc.line(textX, nameLineY, textX + 32, nameLineY);

    // Descripción (máx 2 líneas para que quepa)
    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const descText  = product.description || 'Pieza artesanal con piedras naturales seleccionadas.';
    const descLines = doc.splitTextToSize(descText, textW);
    doc.text(descLines.slice(0, 2), textX, nameLineY + 5);

    // Materiales (1 línea)
    if (product.materials?.length) {
      const matsY   = nameLineY + 5 + Math.min(descLines.length, 2) * 4 + 3;
      const matText = product.materials.map((m: any) => m.name).join(' · ');
      doc.setTextColor(...C.gold);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.setCharSpace(1.2);
      doc.text(matText.toUpperCase(), textX, matsY);
      doc.setCharSpace(0);
    }

    // Precio
    const priceY = cardY + cardH - 7;
    doc.setTextColor(...C.ink);
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.text(`$${product.price.toFixed(2)}`, textX, priceY);

    // ✦ decorativo
    doc.setTextColor(...C.goldLight);
    doc.setFontSize(14);
    doc.text('✦', W - margin - 10, priceY - 1);
  }

  private drawImagePlaceholder(doc: jsPDF, x: number, y: number, w: number, h: number): void {
    doc.setFillColor(...C.petal);
    doc.roundedRect(x, y, w, h, 3, 3, 'F');
    doc.setTextColor(...C.gold);
    doc.setFont('times', 'bold');
    doc.setFontSize(28);
    doc.text('◉', x + w / 2, y + h / 2 + 4, { align: 'center' });
    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text('IMAGEN', x + w / 2, y + h / 2 + 11, { align: 'center' });
  }

  private drawPageFooter(doc: jsPDF, pageNum: number): void {
    const W = 210, H = 297;
    doc.setDrawColor(...C.goldLight);
    doc.setLineWidth(0.4);
    doc.line(14, H - 18, W - 14, H - 18);
    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text('© 2026 Mary · Curado con amor y cristales', 14, H - 12);
    doc.text(`${pageNum}`, W - 14, H - 12, { align: 'right' });
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

    // ✅ Fix doc.GState — reemplazado por color sutil sin opacidad
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

  private getCategoryColor(categoryName?: string): [number, number, number] {
    const map: Record<string, [number, number, number]> = {
      'Pulseras':   [155, 114, 207],
      'Collares':   [212, 130, 154],
      'Pendientes': [ 58, 172, 168],
      'Anillos':    [212, 146,  42],
    };
    return map[categoryName ?? ''] ?? C.gold;
  }

  private drawBadge(doc: jsPDF, x: number, y: number, text: string): void {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const bW = doc.getTextWidth(text) + 22;
    doc.setFillColor(...C.white);
    doc.roundedRect(x, y - 7, bW, 9, 4, 4, 'F');
    doc.setTextColor(...C.gold);
    doc.setFontSize(9);
    doc.text('✦', x + 4, y - 1);
    doc.setTextColor(...C.ink);
    doc.setFontSize(7.5);
    doc.setCharSpace(0.5);
    doc.text(text, x + 13, y - 1);
    doc.setCharSpace(0);
  }
}