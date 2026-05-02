import {AppBar, Box, Container, Toolbar, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import {useAppSelector} from "../../app/hooks.ts";
import {userSelector} from "../../features/users/usersSelectors.ts";
import UserMenu from "./UserMenu/UserMenu.tsx";
import AnonymousMenu from "./AnonimusMenu/AnonymousMenu.tsx";

const Header= () => {
    const user = useAppSelector(userSelector);
    return (
        <div>
            <AppBar position="static" sx={{ backgroundColor: "grey.700" }}>
                <Container maxWidth="xl">
                    <Toolbar sx={{px:0}}>
                        <Typography variant="h4" sx={{ flexGrow: 1 }}>
                            <NavLink
                                to='/'
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >Cafe critic</NavLink>
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            {user ? <UserMenu user={user}/> : <AnonymousMenu/>}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
};

export default Header;