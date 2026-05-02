import {Button} from "@mui/material";
import {NavLink} from "react-router-dom";


const AnonymousMenu = () => {
    return (
        <>
            <Button
                color="inherit"
                component={NavLink}
                to="/register"
            >
                Sign Up
            </Button>

            <Button
                variant="outlined"
                color="inherit"
                component={NavLink}
                to="/login"
            >
                Sign In
            </Button>
        </>
    );
};

export default AnonymousMenu;