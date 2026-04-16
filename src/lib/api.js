import { supabase } from './supabase';

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function signUp({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithProvider(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Coffees ────────────────────────────────────────────────────────────────

export async function fetchCoffees() {
  const { data, error } = await supabase
    .from('coffees')
    .select('*')
    .order('avg_rating', { ascending: false });
  if (error) throw error;
  return data;
}

export async function lookupByEAN(ean) {
  const { data, error } = await supabase
    .from('coffees')
    .select('*')
    .eq('ean', ean)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function addCoffee(coffee) {
  const { data, error } = await supabase
    .from('coffees')
    .insert(coffee)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export async function fetchReviews(coffeeId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(name)')
    .eq('coffee_id', coffeeId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addReview({ coffeeId, userId, rating, comment }) {
  const { data, error } = await supabase
    .from('reviews')
    .upsert({ coffee_id: coffeeId, user_id: userId, rating, comment }, { onConflict: 'user_id,coffee_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Local Favorites (sans compte) ──────────────────────────────────────────

const LOCAL_FAVS_KEY = 'roastly_local_favs';

export function getLocalFavoriteIds() {
  try { return JSON.parse(localStorage.getItem(LOCAL_FAVS_KEY) || '[]'); }
  catch { return []; }
}

export function isLocalFavorite(coffeeId) {
  return getLocalFavoriteIds().includes(coffeeId);
}

export function toggleLocalFavorite(coffeeId) {
  const ids = getLocalFavoriteIds();
  const next = ids.includes(coffeeId) ? ids.filter(id => id !== coffeeId) : [...ids, coffeeId];
  localStorage.setItem(LOCAL_FAVS_KEY, JSON.stringify(next));
  return !ids.includes(coffeeId);
}

export async function syncLocalFavoritesToSupabase(userId) {
  const ids = getLocalFavoriteIds();
  if (!ids.length) return;
  await Promise.all(ids.map(coffeeId => addFavorite(userId, coffeeId)));
  localStorage.removeItem(LOCAL_FAVS_KEY);
}

// ─── Favorites ──────────────────────────────────────────────────────────────

export async function fetchFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('coffee_id, coffees(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return data.map(f => f.coffees);
}

export async function addFavorite(userId, coffeeId) {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, coffee_id: coffeeId });
  if (error && error.code !== '23505') throw error; // ignore duplicate
}

export async function removeFavorite(userId, coffeeId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('coffee_id', coffeeId);
  if (error) throw error;
}

export async function isFavorite(userId, coffeeId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('coffee_id')
    .eq('user_id', userId)
    .eq('coffee_id', coffeeId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

// ─── User stats & taste profile ─────────────────────────────────────────────

export async function fetchUserReview(userId, coffeeId) {
  const { data } = await supabase
    .from('reviews')
    .select('rating, comment')
    .eq('user_id', userId)
    .eq('coffee_id', coffeeId)
    .maybeSingle();
  return data || null;
}

export async function fetchUserStats(userId) {
  const [favsRes, reviewsRes] = await Promise.all([
    supabase.from('favorites').select('coffee_id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('reviews').select('coffee_id', { count: 'exact', head: true }).eq('user_id', userId),
  ]);
  return {
    favorites: favsRes.count || 0,
    reviews: reviewsRes.count || 0,
  };
}

export async function fetchUserTasteProfile(userId) {
  // Fetch all reviews with related coffee flavor_profile
  const { data, error } = await supabase
    .from('reviews')
    .select('rating, coffees(flavor_profile, tags)')
    .eq('user_id', userId)
    .gte('rating', 3); // only coffees the user liked
  if (error || !data || data.length === 0) return null;

  const totals = {};
  const counts = {};
  const tagFreq = {};

  data.forEach(({ rating, coffees: coffee }) => {
    if (!coffee) return;
    const weight = rating / 5;
    (coffee.flavor_profile || []).forEach(({ label, v }) => {
      totals[label] = (totals[label] || 0) + v * weight;
      counts[label] = (counts[label] || 0) + 1;
    });
    (coffee.tags || []).forEach(tag => {
      tagFreq[tag] = (tagFreq[tag] || 0) + rating;
    });
  });

  const profile = Object.entries(totals).map(([label, sum]) => ({
    l: label,
    v: Math.round(sum / counts[label]),
  }));

  const topTags = Object.entries(tagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  return { profile, topTags, reviewCount: data.length };
}

// ─── Open Food Facts ────────────────────────────────────────────────────────

export async function fetchFromOpenFoodFacts(ean) {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${ean}.json`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== 1 || !json.product) return null;
    const p = json.product;
    const categories = (p.categories_tags || []).join(' ').toLowerCase();
    const isCoffee = categories.includes('coffee') || categories.includes('café') || categories.includes('kaffee') || categories.includes('en:coffees');
    if (!isCoffee) return null;
    return {
      name: p.product_name_fr || p.product_name || '',
      brand: p.brands || '',
      origin_country: p.origins_tags?.[0]?.replace('en:', '').replace(/-/g, ' ') || '',
      image_url: p.image_front_url || p.image_url || '',
      quantity: p.quantity || '',
    };
  } catch {
    return null;
  }
}

// ─── Scan History ───────────────────────────────────────────────────────────

export async function addScanToHistory({ userId, coffeeId, ean, found }) {
  const { error } = await supabase
    .from('scan_history')
    .insert({ user_id: userId, coffee_id: coffeeId, ean_scanned: ean, found });
  if (error) throw error;
}

export async function fetchScanHistory(userId) {
  const { data, error } = await supabase
    .from('scan_history')
    .select('*, coffees(*)')
    .eq('user_id', userId)
    .order('scanned_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}
