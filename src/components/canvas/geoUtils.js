import L from 'leaflet'

export function latLngsToGeoPolygon(latlngs) {
  if (!latlngs?.length) return null
  const ring = latlngs.map((ll) => [ll.lng, ll.lat])
  const first = ring[0]
  const last = ring[ring.length - 1]
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([...first])
  }
  return { type: 'Polygon', coordinates: [ring] }
}

export function geoJsonToLatLngs(geometry) {
  if (!geometry?.coordinates?.[0]) return []
  const ring = geometry.coordinates[0]
  return ring.slice(0, -1).map(([lng, lat]) => L.latLng(lat, lng))
}
