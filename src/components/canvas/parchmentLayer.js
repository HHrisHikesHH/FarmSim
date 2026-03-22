import L from 'leaflet'

/** Warm parchment tiles: straw fill + subtle clay dot grid */
export function createParchmentLayer() {
  const ParchmentLayer = L.GridLayer.extend({
    createTile() {
      const tile = document.createElement('canvas')
      const size = this.getTileSize()
      tile.width = size.x
      tile.height = size.y
      const ctx = tile.getContext('2d')
      if (!ctx) return tile
      ctx.fillStyle = '#F5ECD1'
      ctx.fillRect(0, 0, size.x, size.y)
      ctx.fillStyle = 'rgba(124, 63, 26, 0.08)'
      const step = 30
      for (let x = 0; x < size.x + step; x += step) {
        for (let y = 0; y < size.y + step; y += step) {
          ctx.beginPath()
          ctx.arc(x, y, 1, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      return tile
    },
  })
  return new ParchmentLayer()
}
