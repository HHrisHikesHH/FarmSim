import { create } from 'zustand'

const ANCHOR_UTC = Date.UTC(2024, 5, 15)

export const useSimStore = create((set) => ({
  isSimulating: false,
  simDate: null,
  isDrawerOpen: false,
  startSimulation: () =>
    set({
      isSimulating: true,
      simDate: ANCHOR_UTC,
      isDrawerOpen: false,
    }),
  stopSimulation: () =>
    set({
      isSimulating: false,
      simDate: null,
      isDrawerOpen: false,
    }),
  setSimDate: (next) =>
    set((state) => ({
      simDate:
        typeof next === 'function' ? next(state.simDate) : next,
    })),
  toggleDrawer: () =>
    set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
}))
