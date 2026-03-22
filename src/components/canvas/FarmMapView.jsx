import L from 'leaflet'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFarmStore } from '../../store/useFarmStore.js'
import { useToast } from '../ui/Toast.jsx'
import { supabase } from '../../lib/supabase.js'
import { polygonAreaAcres, polygonCentroid } from '../../lib/polygonArea.js'
import { nextPlotColor, waterLabel } from '../../lib/plotConstants.js'
import { geoJsonToLatLngs, latLngsToGeoPolygon } from './geoUtils.js'
import { createParchmentLayer } from './parchmentLayer.js'
import { DesktopPlotsList } from './DesktopPlotsList.jsx'
import { DeletePlotModal } from './DeletePlotModal.jsx'
import { PlotDetailPanel } from './PlotDetailPanel.jsx'
import { PlotFormSheet } from './PlotFormSheet.jsx'

function useOnlineStatus() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

function MapToolbar({ mapMode, onMode }) {
  const tips = {
    draw: 'Draw Plot',
    pan: 'Pan / Select',
    delete: 'Delete plot',
  }
  return (
    <div className="pointer-events-auto absolute left-4 top-1/2 z-[1000] flex -translate-y-1/2 flex-col gap-2 rounded-2xl border border-border bg-white p-2 shadow-lg">
      {[
        { id: 'draw', icon: '✏️', label: tips.draw },
        { id: 'pan', icon: '✋', label: tips.pan },
        { id: 'delete', icon: '🗑️', label: tips.delete },
      ].map((b) => (
        <button
          key={b.id}
          type="button"
          title={b.label}
          onClick={() => onMode(b.id)}
          className={[
            'flex h-11 w-11 items-center justify-center rounded-xl text-lg transition active:scale-[0.97]',
            mapMode === b.id && b.id === 'draw' && 'bg-terracotta text-white',
            mapMode === b.id && b.id === 'pan' && 'bg-leaf text-white',
            mapMode === b.id && b.id === 'delete' && 'bg-red-600 text-white',
            mapMode !== b.id && 'bg-straw/80 text-soil hover:bg-straw',
          ].join(' ')}
        >
          {b.icon}
        </button>
      ))}
    </div>
  )
}

function MapZoomControls({ mapRef, mobile }) {
  const z = () => mapRef.current?.zoomIn()
  const zout = () => mapRef.current?.zoomOut()
  return (
    <div
      className={[
        'pointer-events-auto absolute z-[1000] flex flex-col gap-2',
        mobile ? 'bottom-[100px] right-5' : 'right-6 top-24',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={z}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-xl text-soil shadow-md transition hover:bg-straw active:scale-[0.97]"
      >
        +
      </button>
      <button
        type="button"
        onClick={zout}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-2xl text-soil shadow-md transition hover:bg-straw active:scale-[0.97]"
      >
        −
      </button>
    </div>
  )
}

function MapSummaryBar({ plots, farm }) {
  if (!plots.length) return null
  const totalAc = plots.reduce(
    (s, p) => s + (Number(p.area_acres) || 0),
    0
  )
  const primary =
    farm?.primary_water_source != null
      ? waterLabel(farm.primary_water_source)
      : '—'
  return (
    <div className="pointer-events-none absolute left-1/2 top-[70px] z-[999] flex min-w-[280px] max-w-[90vw] -translate-x-1/2 animate-summary-in flex-wrap items-center justify-center gap-4 rounded-2xl border border-border bg-white px-5 py-2.5 text-center shadow-lg">
      <div>
        <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-terracotta">
          Plots
        </div>
        <div className="font-display text-[0.9rem] font-semibold text-soil">
          🗺️ {plots.length}
        </div>
      </div>
      <div className="h-8 w-px bg-border" />
      <div>
        <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-terracotta">
          Total
        </div>
        <div className="font-display text-[0.9rem] font-semibold text-soil">
          📐 {totalAc.toFixed(1)} ac
        </div>
      </div>
      <div className="h-8 w-px bg-border" />
      <div>
        <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-terracotta">
          Water
        </div>
        <div className="font-display text-[0.9rem] font-semibold text-soil">
          💧 {primary}
        </div>
      </div>
    </div>
  )
}

function MapFab({ onClick, pulse, showLabel }) {
  return (
    <div
      className={[
        'pointer-events-auto absolute right-5 z-[1000] md:right-6',
        showLabel ? 'bottom-[100px] md:bottom-6' : 'bottom-[100px] md:bottom-6',
      ].join(' ')}
    >
      <div className="group flex items-center gap-2">
        <span className="hidden rounded-full bg-soil px-3 py-1 text-xs font-medium text-white opacity-0 shadow-md transition group-hover:opacity-100 md:inline">
          Add Plot
        </span>
        <button
          type="button"
          onClick={onClick}
          className={[
            'flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-3xl font-light text-white shadow-[0_4px_20px_rgba(194,98,45,0.45)] transition active:scale-[0.92]',
            pulse ? 'animate-fab-hint' : '',
          ].join(' ')}
          style={{ lineHeight: 1 }}
        >
          +
        </button>
      </div>
    </div>
  )
}

function MapEmptyState({ show }) {
  if (!show) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center p-6">
      <div className="max-w-xs rounded-2xl bg-straw/95 p-6 text-center shadow-sm">
        <div className="text-5xl">🌾</div>
        <p className="mt-3 font-display text-lg text-soil">Your farm is empty</p>
        <p className="mt-1 text-sm text-muted">
          Tap + to draw your first plot
        </p>
        <div
          className="mt-4 text-3xl text-terracotta animate-arrow-bob"
          aria-hidden
        >
          ↘
        </div>
      </div>
    </div>
  )
}

export function FarmMapView({ farm }) {
  const toast = useToast()
  const online = useOnlineStatus()
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const plotGroupRef = useRef(null)
  const drawGroupRef = useRef(null)
  const labelMarkersRef = useRef([])
  const mapModeRef = useRef('pan')

  const plots = useFarmStore((s) => s.plots)
  const farmId = useFarmStore((s) => s.farmId)
  const selectedPlotId = useFarmStore((s) => s.selectedPlotId)
  const setSelectedPlotId = useFarmStore((s) => s.setSelectedPlotId)
  const setDrawingMode = useFarmStore((s) => s.setDrawingMode)
  const addPlot = useFarmStore((s) => s.addPlot)
  const updatePlot = useFarmStore((s) => s.updatePlot)
  const removePlot = useFarmStore((s) => s.removePlot)

  const [mapMode, setMapMode] = useState('pan')
  const [drawVertices, setDrawVertices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formCalcAcres, setFormCalcAcres] = useState(null)
  const [draftLatLngs, setDraftLatLngs] = useState(null)
  const [editingPlot, setEditingPlot] = useState(null)
  const [redrawPlotId, setRedrawPlotId] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePlot, setDeletePlot] = useState(null)
  const [nameError, setNameError] = useState(false)
  const [mapZoom, setMapZoom] = useState(15)
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : true
  )

  const selected = useMemo(
    () => plots.find((p) => p.id === selectedPlotId) ?? null,
    [plots, selectedPlotId]
  )

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    mapModeRef.current = mapMode
    setDrawingMode(mapMode === 'draw')
    const el = containerRef.current
    if (el) {
      el.classList.toggle('cursor-crosshair', mapMode === 'draw')
    }
  }, [mapMode, setDrawingMode])

  const clearDrawing = useCallback(() => {
    setDrawVertices([])
    setDraftLatLngs(null)
    setFormCalcAcres(null)
    setEditingPlot(null)
    setRedrawPlotId(null)
    const g = drawGroupRef.current
    if (g) g.clearLayers()
  }, [])

  const clearVerticesOnly = useCallback(() => {
    setDrawVertices([])
    drawGroupRef.current?.clearLayers()
  }, [])

  const rebuildDrawLayers = useCallback(() => {
    const g = drawGroupRef.current
    const map = mapRef.current
    if (!g || !map) return
    g.clearLayers()
    drawVertices.forEach((ll) => {
      L.circleMarker(ll, {
        radius: 5,
        color: '#2C1A0E',
        weight: 2,
        fillColor: '#fff',
        fillOpacity: 1,
      }).addTo(g)
    })
    if (drawVertices.length >= 2) {
      L.polyline(drawVertices, {
        color: '#C2622D',
        weight: 2,
        dashArray: '6 6',
      }).addTo(g)
    }
  }, [drawVertices])

  useEffect(() => {
    rebuildDrawLayers()
  }, [rebuildDrawLayers])

  useEffect(() => {
    const el = containerRef.current
    if (!el || mapRef.current) return

    const map = L.map(el, {
      center: [17.33, 76.82],
      zoom: 15,
      minZoom: 10,
      maxZoom: 20,
      zoomControl: false,
      attributionControl: false,
    })
    mapRef.current = map
    createParchmentLayer().addTo(map)

    plotGroupRef.current = L.layerGroup().addTo(map)
    drawGroupRef.current = L.layerGroup().addTo(map)

    const onMapClick = (e) => {
      if (mapModeRef.current !== 'draw') return
      setDrawVertices((v) => [...v, e.latlng])
    }
    map.on('click', onMapClick)
    const onZoomEnd = () => setMapZoom(map.getZoom())
    map.on('zoomend', onZoomEnd)
    onZoomEnd()

    map.whenReady(() => {
      el.classList.add('animate-map-fade-in', 'opacity-100')
    })

    return () => {
      map.off('click', onMapClick)
      map.off('zoomend', onZoomEnd)
      map.remove()
      mapRef.current = null
      plotGroupRef.current = null
      drawGroupRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const onResize = () => map.invalidateSize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const stylePolygon = (plot, selectedId, hovered) => {
    const c = plot.color || '#3A6B35'
    const isSel = plot.id === selectedId
    if (isSel) {
      return {
        color: '#ffffff',
        weight: 4,
        opacity: 1,
        fillColor: c,
        fillOpacity: 0.45,
      }
    }
    return {
      color: c,
      weight: hovered ? 3.5 : 2.5,
      opacity: 0.9,
      fillColor: c,
      fillOpacity: hovered ? 0.5 : 0.3,
    }
  }

  useEffect(() => {
    const map = mapRef.current
    const group = plotGroupRef.current
    if (!map || !group) return
    labelMarkersRef.current.forEach((m) => map.removeLayer(m))
    labelMarkersRef.current = []
    group.clearLayers()

    plots.forEach((plot) => {
      const latlngs = geoJsonToLatLngs(plot.geometry)
      if (latlngs.length < 3) return
      const poly = L.polygon(latlngs, {
        ...stylePolygon(plot, selectedPlotId, false),
        interactive: mapMode !== 'draw',
      })
      poly.on('mouseover', () => {
        if (mapMode === 'draw') return
        poly.setStyle(stylePolygon(plot, selectedPlotId, true))
      })
      poly.on('mouseout', () => {
        poly.setStyle(stylePolygon(plot, selectedPlotId, false))
      })
      poly.on('click', (ev) => {
        L.DomEvent.stopPropagation(ev)
        if (mapMode === 'draw') return
        if (mapMode === 'delete') {
          setDeletePlot(plot)
          setDeleteOpen(true)
          return
        }
        setSelectedPlotId(plot.id)
        setDetailOpen(true)
      })
      poly.addTo(group)

      if (mapZoom >= 13) {
        const c = polygonCentroid(latlngs)
        if (c) {
          const icon = L.divIcon({
            className: 'plot-label-icon',
            html: `<div class="plot-label-pill"><div class="plot-label-name">${escapeHtml(plot.name)}</div><div class="plot-label-area">${plot.area_acres != null ? Number(plot.area_acres).toFixed(1) + ' ac' : '—'}</div></div>`,
            iconSize: [1, 1],
          })
          const m = L.marker(c, { icon, interactive: false })
          m.addTo(map)
          labelMarkersRef.current.push(m)
        }
      }
    })
  }, [plots, selectedPlotId, mapMode, mapZoom, setSelectedPlotId])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selected || !detailOpen) return
    const latlngs = geoJsonToLatLngs(selected.geometry)
    if (latlngs.length < 3) return
    const b = L.latLngBounds(latlngs)
    const pad = mobile ? [40, 40] : [80, 360]
    map.fitBounds(b, { padding: pad, maxZoom: 18, animate: true })
  }, [selectedPlotId, selected, detailOpen, mobile])

  const completeDraw = () => {
    if (drawVertices.length < 3) return
    const ring = [...drawVertices]
    const ac = polygonAreaAcres(ring)
    setFormCalcAcres(ac)
    setDraftLatLngs(ring)
    setDrawVertices([])
    drawGroupRef.current?.clearLayers()
    setShowForm(true)
    if (redrawPlotId) {
      const existing = plots.find((p) => p.id === redrawPlotId)
      setEditingPlot(existing ?? null)
    } else {
      setEditingPlot(null)
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setNameError(false)
    clearVerticesOnly()
    setDraftLatLngs(null)
    setFormCalcAcres(null)
    setMapMode('pan')
    setRedrawPlotId(null)
    setEditingPlot(null)
  }

  const savePlotFromForm = async (values) => {
    if (!values.name?.trim()) {
      setNameError(true)
      return
    }
    const area = parseFloat(values.area_acres, 10)
    if (Number.isNaN(area) || area <= 0) {
      toast.show({ message: 'Enter a valid area greater than zero.', type: 'error' })
      return
    }
    if (!online) {
      toast.show({ message: 'You are offline.', type: 'error' })
      return
    }
    const geo = latLngsToGeoPolygon(draftLatLngs)
    if (!geo) return

    const color =
      editingPlot?.color ?? nextPlotColor(plots.length)

    const row = {
      farm_id: farmId,
      name: values.name.trim(),
      area_acres: area,
      soil_type: values.soil_type,
      water_source: values.water_source,
      notes: values.notes || null,
      geometry: geo,
      color,
    }

    if (editingPlot?.id) {
      const { data, error } = await supabase
        .from('plots')
        .update({
          name: row.name,
          area_acres: row.area_acres,
          soil_type: row.soil_type,
          water_source: row.water_source,
          notes: row.notes,
          geometry: row.geometry,
          color: row.color,
        })
        .eq('id', editingPlot.id)
        .select()
        .single()
      if (error) {
        toast.show({ message: error.message, type: 'error' })
        return
      }
      updatePlot(editingPlot.id, data)
      toast.show({
        message: `${data.name} updated — ${Number(data.area_acres).toFixed(1)} acres`,
        type: 'success',
      })
    } else {
      const { data, error } = await supabase
        .from('plots')
        .insert(row)
        .select()
        .single()
      if (error) {
        toast.show({ message: error.message, type: 'error' })
        return
      }
      addPlot(data)
      toast.show({
        message: `${data.name} added — ${Number(data.area_acres).toFixed(1)} acres`,
        type: 'success',
      })
    }

    setShowForm(false)
    clearDrawing()
    setMapMode('pan')
  }

  const confirmDelete = async () => {
    if (!deletePlot || !online) return
    const { error } = await supabase.from('plots').delete().eq('id', deletePlot.id)
    if (error) {
      toast.show({ message: error.message, type: 'error' })
      return
    }
    removePlot(deletePlot.id)
    setDeleteOpen(false)
    setDeletePlot(null)
    setDetailOpen(false)
    setSelectedPlotId(null)
    toast.show({ message: `${deletePlot.name} deleted.`, type: 'info' })
  }

  const onToolbarMode = (id) => setMapMode(id)

  const openNewDraw = () => {
    clearVerticesOnly()
    setShowForm(false)
    setDraftLatLngs(null)
    setFormCalcAcres(null)
    setEditingPlot(null)
    setRedrawPlotId(null)
    setMapMode('draw')
  }

  const mobileToolbar = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col lg:flex-row">
      {!online ? (
        <div className="absolute left-0 right-0 top-0 z-[2000] bg-ochre/95 px-3 py-2 text-center text-sm text-soil">
          You&apos;re offline — changes will save when connected.
        </div>
      ) : null}

      <DesktopPlotsList
        plots={plots}
        selectedId={selectedPlotId}
        onSelect={(id) => {
          setSelectedPlotId(id)
          setDetailOpen(true)
        }}
        onNewPlot={openNewDraw}
      />

      <div
        className={[
          'relative min-h-0 flex-1 transition-[margin] duration-300',
          detailOpen && !mobile ? 'lg:mr-[360px]' : '',
        ].join(' ')}
      >
        <div
          ref={containerRef}
          className="h-full min-h-[280px] w-full opacity-0"
        />

        <MapSummaryBar plots={plots} farm={farm} />
        <MapToolbar mapMode={mapMode} onMode={onToolbarMode} />
        <MapZoomControls mapRef={mapRef} mobile={!mobileToolbar} />
        <MapFab
          onClick={openNewDraw}
          pulse={plots.length === 0}
          showLabel
        />
        <MapEmptyState show={plots.length === 0 && mapMode !== 'draw'} />

        {mapMode === 'draw' && drawVertices.length >= 3 ? (
          <div className="pointer-events-auto absolute bottom-28 left-1/2 z-[1100] flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-10">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs text-soil shadow">
              {drawVertices.length} points — tap ✓ to complete or keep adding
            </span>
            <button
              type="button"
              onClick={completeDraw}
              className="rounded-full bg-leaf px-5 py-2 text-sm font-semibold text-white shadow-md transition active:scale-[0.97]"
            >
              ✓ Done
            </button>
          </div>
        ) : null}

        {mapMode === 'draw' ? (
          <div className="pointer-events-none absolute left-4 top-20 z-[900] rounded bg-white/90 px-2 py-1 text-xs text-soil shadow">
            Crosshair mode — tap map to place corners
          </div>
        ) : null}
      </div>

      <PlotDetailPanel
        plot={selected}
        open={detailOpen && !!selected}
        mobile={mobile}
        onClose={() => {
          setDetailOpen(false)
          setSelectedPlotId(null)
        }}
        onEdit={() => {
          setEditingPlot(selected)
          const latlngs = geoJsonToLatLngs(selected.geometry)
          setDraftLatLngs(latlngs)
          setFormCalcAcres(polygonAreaAcres(latlngs))
          setShowForm(true)
          setDetailOpen(false)
        }}
        onDelete={() => {
          setDeletePlot(selected)
          setDeleteOpen(true)
        }}
      />

      <PlotFormSheet
        open={showForm}
        offline={!online}
        calculatedAcres={formCalcAcres}
        nameError={nameError}
        onClearNameError={() => setNameError(false)}
        showRedraw={!!editingPlot}
        onRedraw={() => {
          setShowForm(false)
          setRedrawPlotId(editingPlot?.id ?? null)
          clearVerticesOnly()
          setMapMode('draw')
        }}
        initialValues={
          editingPlot
            ? {
                id: editingPlot.id,
                name: editingPlot.name,
                area_acres: editingPlot.area_acres,
                soil_type: editingPlot.soil_type,
                water_source: editingPlot.water_source,
                notes: editingPlot.notes,
              }
            : {
                soil_type: 'black_cotton',
                water_source: farm?.primary_water_source || 'rainfed',
              }
        }
        onClose={cancelForm}
        onSave={savePlotFromForm}
      />

      <DeletePlotModal
        open={deleteOpen}
        plotName={deletePlot?.name ?? ''}
        onCancel={() => {
          setDeleteOpen(false)
          setDeletePlot(null)
        }}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
