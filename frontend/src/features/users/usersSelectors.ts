import type {RootState} from "../../app/store/store.ts";

export const userSelector = (state: RootState) => state.user.user;
export const registerLoadingSelector = (state: RootState) => state.user.registerLoading;
export const registerErrorSelector = (state: RootState) => state.user.registerError;

export const loginLoadingSelector = (state: RootState) => state.user.loginLoading;
export const loginErrorSelector = (state: RootState) => state.user.loginError;