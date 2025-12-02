const PY_API_BASE = process.env.REACT_APP_PY_API_URL || 'http://127.0.0.1:8000/api'

export const analisisIAService = {
  async analizarMalasCalificaciones() {
    const res = await fetch(`${PY_API_BASE}/analisis/productos/malas-calificaciones/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const j = await res.json()
    if (!res.ok) throw new Error(j?.detail || j?.error || 'Error al analizar malas calificaciones')
    return j?.data ?? j
  },
  async resumenProducto(product_id) {
    const id = Number(product_id)
    if (!Number.isFinite(id) || id <= 0) throw new Error('ID de producto inválido')
    const res = await fetch(`${PY_API_BASE}/analisis/productos/${encodeURIComponent(id)}/resumen/`)
    const j = await res.json()
    if (!res.ok) throw new Error(j?.detail || j?.error || 'Error al obtener resumen de producto')
    return j?.data ?? j
  }
}