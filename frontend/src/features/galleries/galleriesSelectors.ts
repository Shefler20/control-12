import type {RootState} from "../../app/store/store.ts";

export const selectGalleries = (state: RootState) => state.gallery.galleries;

export const selectGalleriesLoadingGet = (state: RootState) => state.gallery.loading.get;

export const selectGalleriesLoadingSend = (state: RootState) => state.gallery.loading.send;

export const selectGalleriesLoadingDelete = (state: RootState) => state.gallery.loading.delete;