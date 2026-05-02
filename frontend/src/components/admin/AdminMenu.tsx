import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
    return (
        <Box
            sx={{
                mt: 2,
                width: 240,
                height: "100%",
                bgcolor: "grey.700",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                borderRadius: 4,
                p: 2
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                Admin Panel:
            </Typography>

            <List>
                <ListItemButton
                    component={NavLink}
                    to="/admin/institutions"
                    sx={{
                        borderRadius: 2,
                        mb: 1,
                        "&.active": {
                            bgcolor: "#3f51b5",
                        },
                        "&:hover": {
                            bgcolor: "#2c2c44",
                        }
                    }}
                >
                    <ListItemText primary="Institutions" />
                </ListItemButton>
            </List>
        </Box>
    );
};

export default AdminMenu;