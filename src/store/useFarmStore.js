import { create } from 'zustand'

export const useFarmStore = create((set) => ({
  farmName: 'My Farm',
  totalAcres: 0,
  plots: [],
  isOnboarded: false,
  setFarmName: (name) => set({ farmName: name }),
  setTotalAcres: (acres) => set({ totalAcres: acres }),
  setPlots: (plots) => set({ plots }),
  setOnboarded: (bool) => set({ isOnboarded: bool }),
}))
