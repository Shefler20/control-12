import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {isAxiosError} from "axios";

interface InstitutionsState {
    institutions: InstitutionListItem[];
    institution: InstitutionDetail | null;
    loading: {
        get: boolean;
        send: boolean;
        delete: boolean;
        getById: boolean;
    }
    institutionError: ValidationError | null;
    institutionErrorGlob: GlobalError | null;
}

const initialState: InstitutionsState = {
    institutions: [],
    institution: null,
    loading: {
        get: false,
        send: false,
        delete: false,
        getById: false
    },
    institutionError: null,
    institutionErrorGlob: null,
}

export const institutionsSlice = createSlice({
    name: 'institution',
    initialState,
    reducers:{},
    extraReducers: builder => {
        builder.addCase(getInstitutions.pending, (state) => {
            state.loading.get = true;
        })
        builder.addCase(getInstitutions.fulfilled, (state, {payload: institutions}) => {
            state.loading.get = false;
            state.institutions = institutions;
        })
        builder.addCase(getInstitutions.rejected, (state) => {
            state.loading.get = false;
        })

        builder.addCase(addInstitution.pending, (state) => {
            state.loading.send = true;
            state.institutionError = null;
        })
        builder.addCase(addInstitution.fulfilled, (state) => {
            state.loading.send = false;
        })
        builder.addCase(addInstitution.rejected, (state, {payload: error}) => {
            state.loading.send = false;
            state.institutionError = error || null;
        })

        builder.addCase(getInfoByInstitution.pending, (state) => {
            state.loading.getById = true;
        })
        builder.addCase(getInfoByInstitution.fulfilled, (state, {payload: institution }) => {
            state.loading.getById = false;
            state.institution = institution;
        })
        builder.addCase(getInfoByInstitution.rejected, (state) => {
            state.loading.getById = false;
        })

        builder.addCase(deleteInstitution.pending, (state) => {
            state.loading.delete = true;
        })
        builder.addCase(deleteInstitution.fulfilled, (state) => {
            state.loading.delete = false;
        })
        builder.addCase(deleteInstitution.rejected, (state) => {
            state.loading.delete = false;
        })
    }
});

export const getInstitutions = createAsyncThunk<InstitutionListItem[], void>(
    "institution/getInstitutions",
    async () => {
        const resp = await axiosApi<InstitutionListItem[]>('/institutions');
        return resp.data;
    });

export const addInstitution = createAsyncThunk<void, InstitutionMutation, { rejectValue: ValidationError }>(
    "institution/addInstitution",
    async (dataInstitutionMutation, {rejectWithValue}) => {
        try {
            const data = new FormData();

            data.append("title", dataInstitutionMutation.title);
            data.append("description", dataInstitutionMutation.description);
            data.append("agreeToTerms", String(dataInstitutionMutation.agreeToTerms));
            if (dataInstitutionMutation.image) {
                data.append("image", dataInstitutionMutation.image);
            }
            await axiosApi.post('/institutions', data);
        }catch (e){
            if (isAxiosError(e) && e.response && e.response.status === 400){
                return rejectWithValue(e.response.data as ValidationError);
            }
            throw e;
        }
    });

export const getInfoByInstitution = createAsyncThunk<InstitutionDetail, {id: string}>(
    "institution/getInfoByInstitution",
    async ({id}) => {
        const resp = await axiosApi(`/institutions/${id}`);
        return resp.data;
    });

export const deleteInstitution = createAsyncThunk<void, {id: string}>(
    "institution/deleteInstitution",
    async ({id}) => {
        await axiosApi.delete(`/institutions/${id}`);
    });

export const institutionReducer = institutionsSlice.reducer;