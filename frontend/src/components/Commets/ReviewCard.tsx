import React from "react";
import {Box, Card, CardContent, Typography, Rating, Divider, IconButton} from "@mui/material";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
    review: Review;
    isAdmin?: boolean;
    onDelete?: (id: string) => void;
}

const ReviewCard: React.FC<Props> = ({ review, onDelete, isAdmin }) => {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>

                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Author: {review.user.displayName}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                    @{review.user.username}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="body1" sx={{ mb: 2 }}>
                    {review.description}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">Quality:</Typography>
                        <Rating value={review.ratings.quality} readOnly size="small" />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">Service:</Typography>
                        <Rating value={review.ratings.service} readOnly size="small" />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">Interior:</Typography>
                        <Rating value={review.ratings.interior} readOnly size="small" />
                    </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Typography variant="caption" color="text.secondary">
                    {dayjs(review.createdAt).format("DD.MM.YYYY")}
                </Typography>

                {isAdmin && onDelete && (
                    <IconButton
                        color="error"
                        onClick={() => onDelete(review._id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                )}

            </CardContent>
        </Card>
    );
};

export default ReviewCard;