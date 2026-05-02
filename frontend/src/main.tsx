import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {Provider} from "react-redux";
import {persistor, store} from "./app/store/store.ts";
import {BrowserRouter} from "react-router-dom";
import {CssBaseline} from "@mui/material";
import {ToastContainer} from "react-toastify";
import {PersistGate} from 'redux-persist/integration/react';
import {GoogleOAuthProvider} from "@react-oauth/google";
import {GOOGLE_CLIENT_ID} from "./globalConst.ts";

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <BrowserRouter>
                    <CssBaseline/>
                    <ToastContainer/>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </GoogleOAuthProvider>
)
