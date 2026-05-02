import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {isAxiosError} from "axios";

interface reviewsState {
    reviews: Review[];
    userHasReview: boolean;
    loading: {
        get: boolean,
        send: boolean,
        delete: boolean,
        check: boolean,
    }
}

const initialState: reviewsState = {
    reviews: [],
    userHasReview: false,
    loading: {
        get: false,
        send: false,
        delete: false,
        check: false,
    }
}

export const reviewsSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getReviewsByInstitution.pending, (state) => {
            state.loading.get = true;
        });
        builder.addCase(getReviewsByInstitution.fulfilled, (state, {payload: reviews}) => {
            state.loading.get = false;
            state.reviews = reviews;
        });
        builder.addCase(getReviewsByInstitution.rejected, (state) => {
            state.loading.get = false;
        });

        builder.addCase(createReview.pending, (state) => {
            state.loading.send = true;
        });
        builder.addCase(createReview.fulfilled, (state) => {
            state.loading.send = false;
        });
        builder.addCase(createReview.rejected, (state) => {
            state.loading.send = false;
        });


        builder.addCase(deleteReview.pending, (state) => {
            state.loading.delete = true;
        });
        builder.addCase(deleteReview.fulfilled, (state) => {
            state.loading.delete = false;
        });
        builder.addCase(deleteReview.rejected, (state) => {
            state.loading.delete = false;
        });

        builder.addCase(checkUserReview.pending, (state) => {
            state.loading.check = true;
        });
        builder.addCase(checkUserReview.fulfilled, (state, {payload: check}) => {
            state.loading.check = false;
            state.userHasReview = check
        });
        builder.addCase(checkUserReview.rejected, (state) => {
            state.loading.check = false;
        });
    }
});

export const getReviewsByInstitution = createAsyncThunk<Review[], string>(
    "reviews/getByInstitution",
    async (institutionId) => {
        const resp = await axiosApi.get<Review[]>(
            `/reviews/institution/${institutionId}`
        );
        return resp.data;
    }
);

export const createReview = createAsyncThunk<void, ReviewMutation, { rejectValue: GlobalError }>(
    "reviews/create",
    async (data, { rejectWithValue }) => {
        try {
            await axiosApi.post<Review>("/reviews", data);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                return rejectWithValue(e.response.data as GlobalError);
            }
            throw e;
        }
    }
);

export const checkUserReview = createAsyncThunk<boolean, string, { rejectValue: GlobalError }>(
    "reviews/check",
    async (institutionId, { rejectWithValue }) => {
        try {
            const resp = await axiosApi.get<{ hasReview: boolean }>(`/reviews/check/${institutionId}`);

            return resp.data.hasReview;
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                return rejectWithValue(e.response.data as GlobalError);
            }
            throw e;
        }
    }
);

export const deleteReview = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
    "reviews/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axiosApi.delete(`/reviews/${id}`);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                return rejectWithValue(e.response.data as GlobalError);
            }
            throw e;
        }
    }
);

export const reviewReducer = reviewsSlice.reducer;