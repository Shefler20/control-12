import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";

interface UsersState {
    user: User | null;
    registerLoading: boolean;
    registerError: ValidationError | null;
    loginLoading: boolean;
    loginError: GlobalError | null;
    logoutLoading: boolean;
    logoutError: boolean;
}

const initialState: UsersState = {
    user: null,
    registerLoading: false,
    registerError: null,
    loginLoading: false,
    loginError: null,
    logoutLoading: false,
    logoutError: false,
}

export const usersSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        resetUser: (state) => {
            state.user = null;
        }
    },
    extraReducers: builder => {
        builder.addCase(register.pending, (state) => {
            state.registerLoading = true;
            state.registerError = null;
        })
        builder.addCase(register.fulfilled, (state, {payload: user}) => {
            state.registerLoading = false;
            state.user = user;
        })
        builder.addCase(register.rejected, (state, {payload: error}) => {
            state.registerLoading = false;
            state.registerError = error || null;
        })

        builder.addCase(login.pending, (state) => {
            state.loginLoading = true;
            state.loginError = null;
        })
        builder.addCase(login.fulfilled, (state, {payload: user}) => {
            state.loginLoading = false;
            state.user = user;
        })
        builder.addCase(login.rejected, (state, {payload: error}) => {
            state.loginLoading = false;
            state.loginError = error || null;
        })

        builder.addCase(logout.pending, (state) => {
            state.logoutLoading = true;
            state.logoutError = false;
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.logoutLoading = false;
            state.user = null;
        });
        builder.addCase(logout.rejected, (state) => {
            state.logoutLoading = false;
            state.logoutError = true;
        });

        builder.addCase(googleLogin.pending, (state) => {
            state.loginLoading = true;
            state.loginError = null;
        })
        builder.addCase(googleLogin.fulfilled, (state, {payload: user}) => {
            state.loginLoading = false;
            state.user = user;
        })
        builder.addCase(googleLogin.rejected, (state, {payload: error}) => {
            state.loginLoading = false;
            state.loginError = error || null;
        })
    }
});

export const register = createAsyncThunk<User, RegisterMutation, {rejectValue: ValidationError}>(
    'user/register',
    async (registerMutation, {rejectWithValue}) => {
        try {
            const data = new FormData();

            data.append("username", registerMutation.username);
            data.append("password", registerMutation.password);
            data.append("displayName", registerMutation.displayName);
            if (registerMutation.avatar) {
                data.append("image", registerMutation.avatar);
            }

            const resp = await axiosApi.post('/users', data);
            return resp.data;
        }catch (e){
            if (isAxiosError(e) && e.response && e.response.status === 400){
                return rejectWithValue(e.response.data);
            }
            throw e;
        }
    }
);

export const logout = createAsyncThunk<void, void>(
    'users/logout',
    async () => {
        const response = await axiosApi.delete<{message: string}>('/users/sessions');
        toast.success(response.data.message);
    });

export const login = createAsyncThunk<User, LoginMutation, {rejectValue: GlobalError}>(
    'user/login',
    async (loginMutation, {rejectWithValue}) => {
        try {
            const resp = await axiosApi.post<{user: User, message: string}>('/users/sessions', loginMutation);
            toast.success(resp.data.message);
            return resp.data.user;
        }catch (e){
            if (isAxiosError(e) && e.response && e.response.status === 400){
                return rejectWithValue(e.response.data as GlobalError);
            }
            throw e;
        }
    }
);

export const googleLogin = createAsyncThunk<User, string, {rejectValue: GlobalError}>(
    'user/googleLogin',
    async (credential, {rejectWithValue}) => {
        try {
            const resp = await axiosApi.post<{saveUser: User, message: string}>('/users/google', {credential});
            toast.success(resp.data.message);
            return resp.data.saveUser;
        }catch (e){
            if (isAxiosError(e) && e.response && e.response.status === 400){
                return rejectWithValue(e.response.data as GlobalError);
            }
            throw e;
        }
    }
);

export const {resetUser} = usersSlice.actions;
export const userReducer = usersSlice.reducer;