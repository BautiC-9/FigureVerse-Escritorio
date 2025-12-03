const PY_API_BASE = process.env.REACT_APP_PY_API_URL || 'http://127.0.0.1:8000/api'

export const analisisIAService = {
  async sincronizarOpinionesProductos() {
    const res = await fetch(`${PY_API_BASE}/opiniones/productos/sync/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const j = await res.json()
    if (!res.ok) throw new Error(j?.detail || j?.error || 'Error al sincronizar opiniones')
    return j?.data ?? j
  },
  async resumenOpinionProducto(product_id) {
    const id = Number(product_id)
    if (!Number.isFinite(id) || id <= 0) throw new Error('ID de producto inválido')
    const res = await fetch(`${PY_API_BASE}/opiniones/producto/${encodeURIComponent(id)}/resumen/`)
    const j = await res.json()
    if (!res.ok) throw new Error(j?.detail || j?.error || 'Error al obtener resumen de opiniones')
    return j?.data ?? j
  }
}
