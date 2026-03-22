export const PLOT_COLOR_PALETTE = [
  '#3A6B35',
  '#C2622D',
  '#4A7FA5',
  '#D4953A',
  '#8B2252',
  '#6BAF65',
  '#7B3F1A',
  '#4A6B8A',
]

export const SOIL_OPTIONS = [
  { value: 'black_cotton', label: 'Black Cotton', icon: '🖤' },
  { value: 'red_laterite', label: 'Red Laterite', icon: '🔴' },
  { value: 'alluvial', label: 'Alluvial', icon: '🟤' },
  { value: 'sandy_loam', label: 'Sandy Loam', icon: '🟡' },
  { value: 'clay_loam', label: 'Clay Loam', icon: '🟫' },
  { value: 'mixed', label: 'Mixed', icon: '⚫' },
]

export const WATER_OPTIONS = [
  { value: 'dam', label: 'Dam', icon: '💧' },
  { value: 'borewell', label: 'Borewell', icon: '🔩' },
  { value: 'rainfed', label: 'Rainfed', icon: '🌧' },
  { value: 'canal', label: 'Canal', icon: '🏞' },
  { value: 'pond', label: 'Pond', icon: '🫙' },
  { value: 'mixed', label: 'Mixed', icon: '🔀' },
]

export function soilLabel(value) {
  return SOIL_OPTIONS.find((o) => o.value === value)?.label ?? value
}

export function waterLabel(value) {
  return WATER_OPTIONS.find((o) => o.value === value)?.label ?? value
}

export function nextPlotColor(existingCount) {
  return PLOT_COLOR_PALETTE[existingCount % PLOT_COLOR_PALETTE.length]
}
