import {Box} from "@mui/material";
import AdminMenu from "../AdminMenu.tsx";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <>
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <AdminMenu />
                <Box sx={{ flexGrow: 1, p: 2 }}>
                    <Outlet />
                </Box>
            </Box>
        </>
    );
};

export default AdminLayout;