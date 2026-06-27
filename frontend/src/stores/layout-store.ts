import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FloatingEditorState {
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutState {
  activeTab: 'dashboard' | 'ide' | 'profile';
  sidebarCollapsed: boolean;
  floatingEditor: FloatingEditorState;
  setActiveTab: (tab: LayoutState['activeTab']) => void;
  toggleSidebar: () => void;
  setFloatingEditor: (state: Partial<FloatingEditorState>) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      activeTab: 'dashboard',
      sidebarCollapsed: false,
      floatingEditor: {
        visible: false,
        x: 100,
        y: 100,
        width: 600,
        height: 400,
      },
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setFloatingEditor: (state) => set((prev) => ({
        floatingEditor: { ...prev.floatingEditor, ...state },
      })),
    }),
    {
      name: 'mentorhub-layout',
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' 
          ? window.localStorage 
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        activeTab: state.activeTab,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
