import type {RootState} from "../../app/store/store.ts";

export const selectReviews = (state: RootState) => state.review.reviews;

export const selectReviewsLoadingGet = (state: RootState) => state.review.loading.get;

export const selectReviewsLoadingSend = (state: RootState) => state.review.loading.send;

export const selectReviewsLoadingDelete = (state: RootState) => state.review.loading.delete;

export const selectReviewsCheck = (state: RootState) => state.review.userHasReview;
