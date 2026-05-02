import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Rating
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as React from "react";

interface Props {
    institution: InstitutionListItem;
}

const InstitutionCard: React.FC<Props> = ({ institution }) => {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
            onClick={() => navigate(`/institution/${institution._id}`)}
        >
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

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                    }}
                >
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

export default InstitutionCard;