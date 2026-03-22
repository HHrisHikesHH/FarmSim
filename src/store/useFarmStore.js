import { create } from 'zustand'

export const useFarmStore = create((set) => ({
  farmId: null,
  farmName: 'My Farm',
  totalAcres: 0,
  plots: [],
  isOnboarded: false,
  selectedPlotId: null,
  isLoadingPlots: false,
  isDrawingMode: false,
  setFarmId: (id) => set({ farmId: id }),
  setFarmName: (name) => set({ farmName: name }),
  setTotalAcres: (acres) => set({ totalAcres: acres }),
  setPlots: (plots) => set({ plots }),
  setOnboarded: (bool) => set({ isOnboarded: bool }),
  addPlot: (plot) =>
    set((s) => ({ plots: [...s.plots, plot] })),
  updatePlot: (id, changes) =>
    set((s) => ({
      plots: s.plots.map((p) =>
        p.id === id ? { ...p, ...changes } : p
      ),
    })),
  removePlot: (id) =>
    set((s) => ({
      plots: s.plots.filter((p) => p.id !== id),
      selectedPlotId:
        s.selectedPlotId === id ? null : s.selectedPlotId,
    })),
  setSelectedPlotId: (id) => set({ selectedPlotId: id }),
  setLoadingPlots: (bool) => set({ isLoadingPlots: bool }),
  setDrawingMode: (bool) => set({ isDrawingMode: bool }),
}))
