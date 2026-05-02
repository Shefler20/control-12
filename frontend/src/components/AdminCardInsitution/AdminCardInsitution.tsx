import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Rating,
    IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import React from "react";
import {useAppSelector} from "../../app/hooks.ts";
import {userSelector} from "../../features/users/usersSelectors.ts";


interface Props {
    institution: InstitutionListItem;
    onDelete?: (id: string) => void;
}

const AdminCardInsitution: React.FC<Props> = ({ institution, onDelete }) => {
    const navigate = useNavigate();
    const user = useAppSelector(userSelector);

    const isAdmin = user?.role === "admin";

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(institution._id);
        }
    };

    const handleClick = () => {
        if (isAdmin) {
            navigate(`/admin/institutions/${institution._id}`);
        } else {
            navigate(`/institutions/${institution._id}`);
        }
    };

    return (
        <Card
            sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "relative",
            }}
            onClick={handleClick}
        >
            {isAdmin && onDelete && (
                <IconButton
                    onClick={handleDelete}
                    color="error"
                    sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
                >
                    <DeleteIcon />
                </IconButton>
            )}

            <CardMedia
                component="img"
                height="180"
                image={`http://localhost:8000/${institution.image}`}
                alt={institution.title}
            />

            <CardContent>
                <Typography variant="h6" noWrap>
                    {institution.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    <Rating
                        value={institution.avgRating}
                        precision={0.1}
                        readOnly
                        size="small"
                    />

                    <Typography variant="body2" color="text.secondary">
                        {institution.avgRating.toFixed(1)}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                        alignItems: "center",
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        💬 {institution.reviewsCount} • 📷 {institution.photosCount}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AdminCardInsitution;