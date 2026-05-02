import {Avatar, Button, Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import {useAppDispatch} from "../../../app/hooks.ts";
import {logout} from "../../../features/users/usersSlice.ts";
import {NavLink} from "react-router-dom";
import {BASE_URL} from "../../../globalConst.ts";

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [anchorEl2, setAnchorEl2] = useState<HTMLElement | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClick2 = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl2(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    const handleLogout = () => {
        dispatch(logout());
    };
    return (
        <>
            <Button variant="text" onClick={handleClick2} color="inherit">
                Add
            </Button>
            <Menu
                anchorEl={anchorEl2}
                open={Boolean(anchorEl2)}
                onClose={handleClose2}
            >
                <MenuItem component={NavLink} to={"/institution/new"}>Institutions</MenuItem>
            </Menu>
            <Button
                variant="outlined"
                onClick={handleClick}
                color="inherit"
                startIcon={
                    <Avatar
                        src={BASE_URL + user.avatar}
                        alt={user.displayName || user.username}
                    >
                        {(user.displayName || user.username)?.[0].toUpperCase()}
                    </Avatar>
                }
            >
                {user.displayName || user.username}!
            </Button>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                {user && user.role === "admin" &&  <MenuItem component={NavLink} to={"/admin"}>Admin</MenuItem>}
            </Menu>
        </>
    );
};

export default UserMenu;