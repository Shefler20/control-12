import './App.css'
import {Container} from "@mui/material";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./containers/Home/Home";
import PageNotFound from "./containers/PageNotFound/PageNotFound.tsx";
import Header from "./components/Header/Header.tsx";
import Register from "./containers/Register/Register.tsx";
import Login from "./containers/Login/Login.tsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.tsx";
import {useAppSelector} from "./app/hooks.ts";
import NewInstitution from "./containers/NewInstitution/NewInstitution.tsx";
import DetailInstitutionInfo from "./containers/DetailInstitutionInfo/DetailInstitutionInfo.tsx";
import AdminLayout from "./components/admin/AdminLayout/AdminLayout.tsx";
import AdminPageInstitutions from "./containers/AdminPageInstitutions/AdminPageInstitutions.tsx";
import AdminPageInstitutionsInfo from "./containers/AdminPageInstitutionsInfo/AdminPageInstitutionsInfo.tsx";
import {userSelector} from "./features/users/usersSelectors.ts";

const App = () => {
    const user = useAppSelector(userSelector);
    return (
        <>
            <Header />
            <Container maxWidth="lg">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/institution/new"
                        element={
                            <PrivateRoute isAllowed={!!user}>
                                <NewInstitution />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/institution/:id" element={<DetailInstitutionInfo />} />

                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute isAllowed={user && user.role === "admin"}>
                                <AdminLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<Navigate to="institutions" replace />} />
                        <Route path="institutions" element={<AdminPageInstitutions />} />
                        <Route path="institutions/:id" element={<AdminPageInstitutionsInfo/>}/>
                    </Route>

                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </Container>
        </>
    );
}

export default App
