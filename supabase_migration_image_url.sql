-- ─── Migration: add image_url column + populate all 65 coffees ────────────────
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor > New query)

-- Step 1: Add column
ALTER TABLE coffees ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Step 2: Populate — 9 curated Unsplash photos assigned by brand/style
-- A = white specialty bag  (Café Lomi, Belleville, specialty FR roasters)
-- B = artisan flat lay     (Terres de Café, Verlet, craft roasters)
-- C = overhead espresso    (Lavazza, Méo, blends)
-- D = dark coffee beans    (Dallmayr, Melitta, Malongo, bold coffees)
-- E = barista latte art    (Illy, Fortnum & Mason)
-- F = barista pour         (Le Grain Noble, Alain Ducasse)
-- G = warm beans overhead  (Tchibo, Lézard, Café de Flore)
-- H = three lattes+plants  (Café des Deux Moulins)
-- I = people with coffee   (Cafés Richard, Whittard, Ob Ela)

-- Image A — white specialty coffee bag
UPDATE coffees SET image_url = 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
WHERE id IN (
  'ac5102c8-b698-46aa-9053-ea0920f348bf', -- Yirgacheffe Natural       (Café Lutécia)
  '0d25dee3-4e91-4f99-a0c2-e31ea86abd01', -- Tarrazu Lavé              (Union Hand-Roasted)
  '1cdfe099-bdb6-4c78-8577-38adff49f710', -- Monte Cóbano Miel         (Café Belleville)
  'e3f189dd-4185-4ed0-8427-7fad6cd47250', -- Geisha Boquete            (Café Lomi)
  'defd9c7a-e138-4224-a5fc-e02691b18a4c', -- Caranavi Naturel          (Café Lomi)
  '9a171168-962f-478d-a113-041873a76c3c', -- Rwanda Nyamasheke         (Café Belleville)
  '466dbaee-7cfc-4892-84fe-639514eb1250', -- Nicaragua Matagalpa       (Café Ob Ela)
  'cde7e09d-8e65-4562-b9d6-617fdca36880', -- Uganda Sipi Falls         (Café Ob Ela)
  'd64b58ec-fd40-4bfa-9526-6e51208d45f7', -- Blend Breakfast Club      (Café Lomi)
  'bac98030-218b-4c3e-8af6-bdfeb4c4007f', -- Timor-Leste Maubere       (Café Belleville)
  '643e10c0-9071-4cdc-85ab-60f793af705a', -- Laos Bolaven Plateau      (Café Ob Ela)
  '847cd86f-cec7-446a-8dde-e46d0cdab669', -- Colombie Wush Wush        (Café Lomi)
  '577f055a-e09f-44d7-9ac1-163c61c2ff2b', -- Rwanda Bourbon Natural    (Café Belleville)
  'ecc8986c-bdf9-417d-a3ed-9cd280975268'  -- Panama Geisha Washed      (Café Lomi)
);

-- Image B — artisan flat lay (coffee tools, beans, latte on wood)
UPDATE coffees SET image_url = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80'
WHERE id IN (
  'e1f2044d-a7b7-4230-8474-22e53d8c6de2', -- Colombia Huila            (Perroquet)
  '1020a847-c881-4f9a-83ac-39aa98f9d8ed', -- Guji Lavé                 (Terres de Café)
  'd8a1167c-0092-4fb8-81c5-d3f364d90d52', -- Chanchamayo Lavé          (Terres de Café)
  'a2539c46-a330-4100-b830-dfb3b95966e3', -- Moka Matari               (Cafés Verlet)
  'af1e2250-c51f-4647-a4a5-6f620f72400c', -- Coonoor Nilgiris          (Café du Monde)
  '0087a019-5621-4d2d-8d7b-37f3a50dc3bc', -- Monsoon Malabar AA        (Cafés Verlet)
  '868e492e-c2fd-4415-89cc-e5112d95f692', -- Burundi Kayanza           (Terres de Café)
  '6be1d92f-183d-42d1-ba82-5e431693db73', -- Harrar Naturel            (Cafés Verlet)
  '6cd627cd-3222-4a08-b848-14e7c0b18c60', -- Flores Bajawa             (Café du Monde)
  '030b6ad6-582a-4180-8562-50d4a1b8017a'  -- Bench Maji Naturel        (Cafés Verlet)
);

-- Image C — overhead espresso cup (warm, wooden table)
UPDATE coffees SET image_url = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
WHERE id IN (
  'a472752e-7cbe-4348-8a2e-511246beccab', -- Supremo Colombiano        (Lavazza)
  '955d223f-c293-45da-a2a0-e055c66d5ae0', -- Blend Espresso Classico   (Lavazza)
  '01e14fe7-180e-4370-b678-7fd89a3dc35c', -- Brasile Santos Premium    (Lavazza)
  '5425dc51-e056-4d73-9199-58e91f4a0df0', -- Chiapas Altura            (Café Méo)
  '9ac9eef9-2d16-449e-ad2a-eb95d7acc43e'  -- Espresso Roma Intenso     (Café Méo)
);

-- Image D — dark coffee beans (bold, commercial)
UPDATE coffees SET image_url = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80'
WHERE id IN (
  'd5e004d5-e72c-4e8c-bddf-ec71df211f20', -- Kenya AA                  (Black Mamba)
  '478477e6-a38f-4f35-9e12-8c8de0d071fd', -- Kenya AA Kirinyaga        (Dallmayr)
  '9fb3cdee-0489-444f-b043-7f00ec3d1d10', -- Santos Naturel            (Malongo)
  '423ceb64-307e-4c18-8c53-2c36ecd86d34', -- Vietnam Robusta Deluxe   (Melitta)
  'ef71842c-c134-4dcf-9597-d629953e84b6', -- Sumatra Mandheling        (Segafredo)
  '947067f8-d86d-4c4a-9c52-ea218f5ebebd', -- Prodomo Entkoffeiniert    (Melitta)
  '35fc441a-630f-496e-885b-3f0260fbc451', -- Kenia Spitzenqualität     (Dallmayr)
  'af492645-3a6c-4b84-b839-9075e4cf0318', -- Tanzanie Kilimanjaro      (Malongo)
  'edbbc4e7-2305-47e4-b522-b5e40cecd880'  -- Decaf Swiss Water Brésil  (Malongo)
);

-- Image E — barista making latte art (elegant, premium)
UPDATE coffees SET image_url = 'https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?auto=format&fit=crop&w=800&q=80'
WHERE id IN (
  'a40d5808-166d-4238-95a6-c63594b856bf', -- Nariño Gold               (Illy)
  '19037fea-6a60-41aa-9faf-985e8459516d', -- Java Preanger Lavé        (Illy)
  '91b525f3-a018-4549-aead-59bfe874d234', -- Gran Selezione Arabica    (Illy)
  '77c498be-c214-4ffa-8123-5f587257e622'  -- Blue Mountain Grade 1     (Fortnum & Mason)
);

-- Image F — barista pouring milk (artisan, French roasters)
UPDATE coffees SET image_url = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80'
WHERE id IN (
  '91e66396-834b-4156-8b4c-0fc9eed2cc28', -- Sidamo Heirloom           (Le Grain Noble)
  'd6943a62-495b-4b6a-9147-a1a8c2cc0372', -- Cerrado Pulpé Naturel     (Café Alain Ducasse)
  '87db256f-f6f8-4386-882a-bbc0986427c8', -- Sumatra Gayo Natural      (Le Grain Noble)
  'ccb7841f-82ce-4708-934c-caf8d9b1c647', -- Popayán Lavé              (Café Alain Ducasse)
  'ba0615b6-319e-4e28-be9e-ca9aa56fdd2c', -- Nekemte Naturel           (Le Grain Noble)
  'eac86afc-5792-4081-84d6-c27e19e4baf4'  -- Mexique Chiapas Decaf     (Le Grain Noble)
);

-- Image G — warm coffee beans overhead (varied origins)
UPDATE coffees SET image_url = 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=800&q=80'
WHERE id IN (
  'f24dc13a-e750-4427-89db-a8d38775ec01', -- Yirgacheffe Naturel       (Café Lézard)
  '77c28a4f-6da7-47a3-909c-1c9a5f1e36c2', -- Nyeri Peaberry            (Tchibo)
  '68a95e7d-aa3f-4d34-821c-40a04e82313e', -- Villa Rica Naturel        (Café Lézard)
  '525010bb-1b9b-4a14-acb1-5bea5fce9b06', -- Huehuetenango Lavé        (Café de Flore)
  '6b3ae1ec-e63a-4d8f-b4fd-ea907331fce4', -- Honduras Copán SHG        (Café Lézard)
  'c662e76c-9dcd-46f5-bdbb-c993a7830055', -- El Salvador Pacamara      (Café de Flore)
  '8289e330-6c8c-4229-aa8d-8da028628966', -- Äthiopien Yirgacheffe     (Tchibo)
  '1c73d7bd-ecc3-4415-8ea8-d8638b06a561', -- Colombia Pink Bourbon     (Café de Flore)
  'ce1eaed6-dbdc-40fd-8057-12de7a47ea2b'  -- Guatemala Acatenango      (Café Lézard)
);

-- Image H — three lattes with plants (atmospheric)
UPDATE coffees SET image_url = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
WHERE id IN (
  '04cc005e-153a-4d2b-a058-c0b4f062fcb1', -- Oaxaca Pluma              (Café des Deux Moulins)
  'e23fc8be-711c-4073-b0e4-4da63bce044f', -- Blend Organic Winter      (Café des Deux Moulins)
  '6dbb2a63-0b85-41d7-8135-4e576c8fbd28'  -- Sumatra Lintong           (Café des Deux Moulins)
);

-- Image I — people toasting/sharing coffee (social)
UPDATE coffees SET image_url = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
WHERE id IN (
  '59d9216a-9c10-4d94-ad9e-3a51d8e75136', -- Antigua SHB               (Cafés Richard)
  'a9f7b9ee-9fd4-4c91-a36e-7e4ee67c9625', -- Mbeya Peaberry            (Cafés Richard)
  'fe9f6a73-5e7b-4a57-8c32-d0325bedd556', -- Sulawesi Toraja           (Cafés Richard)
  'a9ce6dff-0bc0-4b6b-831f-89b03cf6fc9f', -- Papua New Guinea Kainantu (Whittard)
  'b694d560-fd40-4bfa-9526-6e51208d45f7'  -- Colombie Excelso Caldas   (Cafés Richard)
);
