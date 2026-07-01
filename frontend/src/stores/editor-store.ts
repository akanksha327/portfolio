import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface FloatingEditorPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EditorState {
  // Editor visibility states
  isEditorOpen: boolean;
  isFloating: boolean;
  isFocusMode: boolean;
  
  // Panel visibility states
  chatVisible: boolean;
  videoVisible: boolean;
  
  // Floating editor position/size
  floatingPosition: FloatingEditorPosition;
  
  // Previous state for restoration
  previousEditorSize: number;
  
  // Actions - Editor
  closeEditor: () => void;
  openEditor: () => void;
  toggleFloating: () => void;
  setFloating: (isFloating: boolean) => void;
  toggleFocusMode: () => void;
  setFocusMode: (isFocusMode: boolean) => void;
  updateFloatingPosition: (position: Partial<FloatingEditorPosition>) => void;
  setPreviousEditorSize: (size: number) => void;
  
  // Actions - Panels
  toggleChat: () => void;
  toggleVideo: () => void;
  setChatVisible: (visible: boolean) => void;
  setVideoVisible: (visible: boolean) => void;
  showAllPanels: () => void;
}

const DEFAULT_FLOATING_POSITION: FloatingEditorPosition = {
  x: 50,
  y: 50,
  width: 650,
  height: 450,
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      isEditorOpen: true,
      isFloating: false,
      isFocusMode: false,
      chatVisible: true,
      videoVisible: true,
      floatingPosition: DEFAULT_FLOATING_POSITION,
      previousEditorSize: 55,

      closeEditor: () => set({ 
        isEditorOpen: false, 
        isFloating: false, 
        isFocusMode: false 
      }),

      openEditor: () => set({ 
        isEditorOpen: true,
        isFloating: false,
        isFocusMode: false
      }),

      toggleFloating: () => {
        const { isFloating, isEditorOpen } = get();
        if (!isEditorOpen) return;
        
        if (isFloating) {
          set({ isFloating: false, isFocusMode: false });
        } else {
          set({ isFloating: true, isFocusMode: false });
        }
      },

      setFloating: (isFloating) => set({ isFloating, isFocusMode: false }),

      toggleFocusMode: () => {
        const { isFocusMode, isEditorOpen, isFloating } = get();
        if (!isEditorOpen) return;
        
        if (isFloating) {
          set({ isFloating: false, isFocusMode: true });
        } else {
          set({ isFocusMode: !isFocusMode });
        }
      },

      setFocusMode: (isFocusMode) => set({ 
        isFocusMode, 
        isFloating: isFocusMode ? false : get().isFloating 
      }),

      updateFloatingPosition: (position) => set((state) => ({
        floatingPosition: { ...state.floatingPosition, ...position }
      })),

      setPreviousEditorSize: (size) => set({ previousEditorSize: size }),

      toggleChat: () => {
        const { chatVisible } = get();
        set({ chatVisible: !chatVisible });
      },

      toggleVideo: () => {
        const { videoVisible } = get();
        set({ videoVisible: !videoVisible });
      },

      setChatVisible: (visible) => set({ chatVisible: visible }),

      setVideoVisible: (visible) => set({ videoVisible: visible }),

      showAllPanels: () => set({ chatVisible: true, videoVisible: true }),
    }),
    {
      name: 'editor-state',
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function'
          ? window.localStorage 
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        isEditorOpen: state.isEditorOpen,
        isFloating: state.isFloating,
        floatingPosition: state.floatingPosition,
        previousEditorSize: state.previousEditorSize,
        chatVisible: state.chatVisible,
        videoVisible: state.videoVisible,
      }),
    }
  )
);
