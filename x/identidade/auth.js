/* TEREON X — motor isolado de identidade. Sem DOM, Listas ou Catálogo. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.TereonXIdentity = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const validEmail = value => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  function create(client) {
    if (!client || !client.auth) throw new Error('Cliente de autenticação indisponível.');
    function requireEmail(email) {
      if (!validEmail(email)) throw new Error('Informe um e-mail válido.');
      return email.trim().toLowerCase();
    }
    async function unpack(result) {
      if (!result || result.error) throw (result && result.error) || new Error('Resposta inválida do servidor.');
      return result.data;
    }
    async function register(email, password, redirectTo) {
      email = requireEmail(email);
      if (typeof password !== 'string' || password.length < 8) throw new Error('Use uma senha com pelo menos 8 caracteres.');
      return unpack(await client.auth.signUp({
        email, password, options: { emailRedirectTo: redirectTo }
      }));
    }
    async function login(email, password) {
      email = requireEmail(email);
      if (!password) throw new Error('Informe sua senha.');
      return unpack(await client.auth.signInWithPassword({ email, password }));
    }
    async function logout() { await unpack(await client.auth.signOut()); }
    async function session() { return (await unpack(await client.auth.getSession())).session; }
    async function currentUser() {
      // Sem sessão é estado normal, não erro: evita bloquear a tela de login.
      const active = await session();
      if (!active) return null;
      const data = await unpack(await client.auth.getUser());
      return data.user || null;
    }
    async function sendReset(email, redirectTo) {
      email = requireEmail(email);
      return unpack(await client.auth.resetPasswordForEmail(email, { redirectTo }));
    }
    async function changePassword(password) {
      if (typeof password !== 'string' || password.length < 8) throw new Error('Use uma senha com pelo menos 8 caracteres.');
      return unpack(await client.auth.updateUser({ password }));
    }
    async function getProfile(userId) {
      const result = await client.from('x_profiles').select('user_id,display_name').eq('user_id', userId).maybeSingle();
      if (result.error) throw result.error;
      return result.data;
    }
    async function saveProfile(userId, displayName) {
      if (!userId) throw new Error('Sessão necessária.');
      const name = String(displayName || '').trim();
      if (name.length > 120) throw new Error('Nome muito longo.');
      const result = await client.from('x_profiles').upsert({ user_id: userId, display_name: name }, { onConflict: 'user_id' }).select('user_id,display_name').single();
      if (result.error) throw result.error;
      return result.data;
    }
    function onChange(callback) {
      const result = client.auth.onAuthStateChange(callback);
      if (!result || !result.data || !result.data.subscription) throw new Error('Observação de sessão indisponível.');
      return () => result.data.subscription.unsubscribe();
    }
    return Object.freeze({ register, login, logout, session, currentUser, sendReset, changePassword, getProfile, saveProfile, onChange });
  }
  return Object.freeze({ create });
});
