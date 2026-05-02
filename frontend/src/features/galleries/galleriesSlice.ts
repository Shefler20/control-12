import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";

interface GalleriesState {
    galleries: GalleryItem[],
    loading: {
        get: boolean;
        send: boolean;
        delete: boolean;
    }
}

const initialState: GalleriesState = {
    galleries: [],
    loading: {
        get: false,
        send: false,
        delete: false,
    }
}

export const galleriesSlice = createSlice({
    name: 'gallery',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getGalleriesByInstitution.pending, (state) => {
            state.loading.get = true;
        })
        builder.addCase(getGalleriesByInstitution.fulfilled, (state, { payload }) => {
            state.loading.get = false;
            state.galleries = payload;
        })
        builder.addCase(getGalleriesByInstitution.rejected, (state) => {
            state.loading.get = false;
        });

        builder.addCase(addGalleriesPhoto.pending, (state) => {
            state.loading.send = true;
        })
        builder.addCase(addGalleriesPhoto.fulfilled, (state) => {
            state.loading.send = false;
        })
        builder.addCase(addGalleriesPhoto.rejected, (state) => {
            state.loading.send = false;
        });

        builder.addCase(deleteGalleriesPhoto.pending, (state) => {
            state.loading.delete = true;
        })
        builder.addCase(deleteGalleriesPhoto.fulfilled, (state) => {
            state.loading.delete = false;
        })
        builder.addCase(deleteGalleriesPhoto.rejected, (state) => {
            state.loading.delete = false;
        });
    }
});

export const getGalleriesByInstitution = createAsyncThunk<GalleryItem[], string>(
    "gallery/getByInstitution",
    async (institutionId) => {
        const resp = await axiosApi(`/galleries/institution/${institutionId}`);
        return resp.data;
    }
);

export const addGalleriesPhoto = createAsyncThunk<void ,GalleryMutation>(
    "gallery/addGalleriesPhoto",
    async (GalleryMutationData) => {
        try {
            const data = new FormData();
            data.append("institution", GalleryMutationData.institution);
            if (GalleryMutationData.image) {
                data.append("image", GalleryMutationData.image);
            }
            await axiosApi.post('/galleries', data);
        }catch (e){
            throw e;
        }
    });

export const deleteGalleriesPhoto = createAsyncThunk<void, string>(
    "gallery/deleteGalleriesPhoto",
    async (id) => {
        await axiosApi.delete(`/galleries/${id}`);
    });

export const galleryReducer = galleriesSlice.reducer;