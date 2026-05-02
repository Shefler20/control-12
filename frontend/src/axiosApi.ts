import axios from "axios";
import {BASE_URL} from "./globalConst.ts";

const axiosApi = axios.create({
    baseURL: BASE_URL,
});

axiosApi.defaults.withCredentials = true;

const logoutAndRedirect = async () => {
    try {
        await axios.delete(`${BASE_URL}/users/sessions`, {withCredentials: true, timeout: 2000});
    }catch(err) {
        console.log("Could not delete sessions from server", err);
    }

    try {
        const {store} = await import("./app/store/store.ts");
        const {resetUser} = await import("./features/users/usersSlice.ts");

        store.dispatch(resetUser());
    }catch(err) {
        console.log("Redux stores error", err);
    }

    if (window.location.pathname !== "/login") {
        window.location.replace('/login');
    }
}

axiosApi.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        originalRequest.url !== '/users/token') {
        originalRequest._retry = true;

        try {
            await axios.post(`${BASE_URL}users/token`, {} , {withCredentials: true});
            return axiosApi(originalRequest);
        }catch (refreshError) {
            await logoutAndRedirect();
            return Promise.reject(refreshError);
        }
    }


    return Promise.reject(error);
});

export default axiosApi;