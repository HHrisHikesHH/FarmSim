import L from 'leaflet'

/** Approximate acres from lat/lng ring (small plots — planar tangent). */
export function polygonAreaAcres(latlngs) {
  if (!latlngs || latlngs.length < 3) return 0
  const avgLat =
    latlngs.reduce((s, p) => s + p.lat, 0) / latlngs.length
  const mPerDegLat = 111320
  const mPerDegLng = 111320 * Math.cos((avgLat * Math.PI) / 180)
  const origin = latlngs[0]
  const xy = latlngs.map((p) => [
    (p.lng - origin.lng) * mPerDegLng,
    (p.lat - origin.lat) * mPerDegLat,
  ])
  let sum = 0
  for (let i = 0; i < xy.length; i++) {
    const j = (i + 1) % xy.length
    sum += xy[i][0] * xy[j][1] - xy[j][0] * xy[i][1]
  }
  const m2 = Math.abs(sum / 2)
  return m2 / 4046.8564224
}

export function polygonCentroid(latlngs) {
  if (!latlngs.length) return null
  let lat = 0
  let lng = 0
  latlngs.forEach((p) => {
    lat += p.lat
    lng += p.lng
  })
  const n = latlngs.length
  return L.latLng(lat / n, lng / n)
}
