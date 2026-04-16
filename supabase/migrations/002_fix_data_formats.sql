-- ============================================================
-- Fix flavor_profile and gradient formats for existing rows
-- flavor_profile: string[] → [{label, v}]
-- gradient: {from, to} → [color1, color2]
-- ============================================================

-- Kenya AA
update public.coffees
set
  flavor_profile = '[{"label":"Acidité","v":85},{"label":"Fruité","v":80},{"label":"Floral","v":50},{"label":"Corps","v":70},{"label":"Douceur","v":55},{"label":"Amertume","v":60}]'::jsonb,
  gradient = ARRAY['#8B4513', '#D2691E']
where ean = '5901234123457';

-- Yirgacheffe Natural
update public.coffees
set
  flavor_profile = '[{"label":"Acidité","v":55},{"label":"Fruité","v":75},{"label":"Floral","v":85},{"label":"Corps","v":50},{"label":"Douceur","v":70},{"label":"Amertume","v":30}]'::jsonb,
  gradient = ARRAY['#4B0082', '#9370DB']
where ean = '4006381333931';

-- Colombia Huila
update public.coffees
set
  flavor_profile = '[{"label":"Acidité","v":50},{"label":"Fruité","v":60},{"label":"Floral","v":30},{"label":"Corps","v":75},{"label":"Douceur","v":80},{"label":"Amertume","v":45}]'::jsonb,
  gradient = ARRAY['#D2691E', '#F4A460']
where ean = '7702032109028';
