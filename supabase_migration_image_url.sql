-- ─── Migration: add image_url column + populate with REAL brand packaging photos ──
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor > New query)
-- This replaces all previous generic Unsplash photos with actual brand packaging images.

-- Step 1: Add column (safe to re-run)
ALTER TABLE coffees ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Step 2: Reset all to NULL so unknown brands fall back to SVG illustration
UPDATE coffees SET image_url = NULL;

-- ─── Café Lomi (Paris) — beige specialty bag with Lomi droplet logo ─────────
UPDATE coffees SET image_url = 'https://cdn.swell.store/lomi/689a042dcdddc00012a86647/76d81ba9ac4ecf0343584f566a84e9a3/JAIDEUXAMOURS_PETIT_2.jpg'
WHERE id IN (
  'e3f189dd-4185-4ed0-8427-7fad6cd47250', -- Geisha Boquete
  'defd9c7a-e138-4224-a5fc-e02691b18a4c', -- Caranavi Naturel
  'd64b58ec-fd40-4bfa-9526-6e51208d45f7', -- Blend Breakfast Club
  '847cd86f-cec7-446a-8dde-e46d0cdab669', -- Colombie Wush Wush
  'ecc8986c-bdf9-417d-a3ed-9cd280975268'  -- Panama Geisha Washed
);

-- ─── Café Belleville Brûlerie (Paris) — navy blue bag on red background ─────
UPDATE coffees SET image_url = 'https://cdn.shopify.com/s/files/1/0110/8118/7428/products/Pack-Shots-Belleville-2021-1000px-9.jpg?v=1624540359'
WHERE id IN (
  '1cdfe099-bdb6-4c78-8577-38adff49f710', -- Monte Cóbano Miel
  '9a171168-962f-478d-a113-041873a76c3c', -- Rwanda Nyamasheke
  'bac98030-218b-4c3e-8af6-bdfeb4c4007f', -- Timor-Leste Maubere
  '577f055a-e09f-44d7-9ac1-163c61c2ff2b'  -- Rwanda Bourbon Natural
);

-- ─── Terres de Café (Paris) — white bag with gold monkey logo ────────────────
UPDATE coffees SET image_url = 'https://www.terresdecafe.com/9697-medium_default/coffee-amazalia.webp'
WHERE id IN (
  '1020a847-c881-4f9a-83ac-39aa98f9d8ed', -- Guji Lavé
  'd8a1167c-0092-4fb8-81c5-d3f364d90d52', -- Chanchamayo Lavé
  '868e492e-c2fd-4415-89cc-e5112d95f692'  -- Burundi Kayanza
);

-- ─── Cafés Verlet (Paris, est. 1880) — white bag with vintage coffee pot ─────
UPDATE coffees SET image_url = 'https://verlet.fr/cdn/shop/files/Moka_Harrar_74a2bb63-67f7-4b81-9322-cbf62d517459.jpg'
WHERE id IN (
  'a2539c46-a330-4100-b830-dfb3b95966e3', -- Moka Matari
  '0087a019-5621-4d2d-8d7b-37f3a50dc3bc', -- Monsoon Malabar AA
  '6be1d92f-183d-42d1-ba82-5e431693db73', -- Harrar Naturel
  '030b6ad6-582a-4180-8562-50d4a1b8017a'  -- Bench Maji Naturel
);

-- ─── Lavazza — gold Qualità Oro bag (100% Arabica) ───────────────────────────
UPDATE coffees SET image_url = 'https://lavazza.co.uk/content/dam/lavazza-athena/it/b2c/pdp-pag-prodotto/coffee/hero-product-banner/2-main-assets-coffee/qualita_oro/new/beans/oro/1936-d-oro-beans_500-ita-%402.png'
WHERE id IN (
  'a472752e-7cbe-4348-8a2e-511246beccab', -- Supremo Colombiano
  '955d223f-c293-45da-a2a0-e055c66d5ae0', -- Blend Espresso Classico
  '01e14fe7-180e-4370-b678-7fd89a3dc35c'  -- Brasile Santos Premium
);

-- ─── Illy — silver Classico bag with red illy logo ────────────────────────────
UPDATE coffees SET image_url = 'https://www.illy.com/dw/image/v2/BBDD_PRD/on/demandware.static/-/Sites-masterCatalog_illycaffe/default/dw73fd82a0/products/sfra/coffee/High1x/I0003859_High_1x_01.png'
WHERE id IN (
  'a40d5808-166d-4238-95a6-c63594b856bf', -- Nariño Gold
  '19037fea-6a60-41aa-9faf-985e8459516d', -- Java Preanger Lavé
  '91b525f3-a018-4549-aead-59bfe874d234'  -- Gran Selezione Arabica
);

-- ─── Cafés Richard (Paris) — white bag with red ROUGE RICHARD logo ───────────
UPDATE coffees SET image_url = 'https://frenchwink.com/cdn/shop/files/nDc8l15mEi.jpg?v=1714678072&width=1500'
WHERE id IN (
  '59d9216a-9c10-4d94-ad9e-3a51d8e75136', -- Antigua SHB
  'a9f7b9ee-9fd4-4c91-a36e-7e4ee67c9625', -- Mbeya Peaberry
  'fe9f6a73-5e7b-4a57-8c32-d0325bedd556', -- Sulawesi Toraja
  'b694d560-fd40-4bfa-9526-6e51208d45f7'  -- Colombie Excelso Caldas
);

-- ─── Whittard of Chelsea — dark navy bag with gold W logo ────────────────────
UPDATE coffees SET image_url = 'https://marvel-b1-cdn.bc0a.com/f00000000263857/www.whittard.com/dw/image/v2/BCGT_PRD/on/demandware.static/-/Sites-whittard-master-catalog/default/dw6a15360f/images/Coffee_Images_Updated_080525/351973_CoffeeDOIBag_Kenya_Peaberry.jpg'
WHERE id IN (
  'a9ce6dff-0bc0-4b6b-831f-89b03cf6fc9f'  -- Papua New Guinea Kainantu
);

-- ─── Remaining brands (37 coffees) fall back to SVG illustration ─────────────
-- Brands without accessible packaging images: Café Lutécia, Union Hand-Roasted,
-- Café Ob Ela, Perroquet, Café du Monde, Café Méo, Black Mamba, Dallmayr,
-- Malongo, Melitta, Segafredo, Fortnum & Mason, Le Grain Noble, Café Alain
-- Ducasse, Café Lézard, Tchibo, Café de Flore, Café des Deux Moulins.
-- Their image_url stays NULL — the app shows a themed SVG illustration instead.
