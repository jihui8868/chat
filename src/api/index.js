const BASE = '/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || '请求失败')
  }
  if (res.status === 204) return null
  return res.json()
}

function parseJwt(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

// ── Auth ───────────────────────────────────────────────────────────────────
export async function login(username, password) {
  const data = await request('/users/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  const payload = parseJwt(data.access_token)
  const user = await request(`/users/${payload.sub}`)
  return { token: data.access_token, user }
}

export function saveAuth(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export function loadAuth() {
  const token = localStorage.getItem('token')
  const raw = localStorage.getItem('user')
  if (!token || !raw) return null
  try {
    const user = JSON.parse(raw)
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(payload))
    if (exp * 1000 < Date.now()) { clearAuth(); return null }
    return { token, user }
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// ── Conversations ──────────────────────────────────────────────────────────
export async function fetchConversations(userId, limit = 50) {
  const res = await request(`/conversations?user_id=${userId}&limit=${limit}`)
  return res.items   // [{ id, title, user_id, status, created_at, updated_at }]
}

export async function createConversation(userId, title = '新对话') {
  return request('/conversations', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, title }),
  })
}

export async function updateConversation(convId, data) {
  return request(`/conversations/${convId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ── Messages ───────────────────────────────────────────────────────────────
export async function fetchMessages(convId, limit = 100) {
  const res = await request(`/conversations/${convId}/messages?limit=${limit}`)
  return res.items   // [{ id, conversation_id, type, content, created_at }]
}

export async function createMessage(convId, type, content) {
  return request(`/conversations/${convId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ type, content }),
  })
}

export async function sendChat(convId, content) {
  return request(`/conversations/${convId}/chat`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}
