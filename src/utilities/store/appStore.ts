import { create } from "zustand";

interface ViewType {
    title: string;
};
interface AppStoreType {
    view: ViewType
    setView: (view: AppStoreType["view"]) => void;
};

const useAppStore = create<AppStoreType>((set) => ({
    view: {
        title: "Woodward-Blog",
        id: ""
    },
    setView: (view) => set(() => ({ view })),
}));

export { useAppStore }
export type { AppStoreType, ViewType }