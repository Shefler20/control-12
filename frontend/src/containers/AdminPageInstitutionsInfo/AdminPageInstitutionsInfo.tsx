import { useEffect } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    Rating,
    Divider,
    IconButton, LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { getInfoByInstitution } from "../../features/institutions/institutionsSlice";
import {
    selectInstitution,
    selectInstitutionByIdLoading
} from "../../features/institutions/institutionsSelector";

import {
    getGalleriesByInstitution,
    deleteGalleriesPhoto
} from "../../features/galleries/galleriesSlice";

import {
    selectGalleries, selectGalleriesLoadingDelete,
    selectGalleriesLoadingGet
} from "../../features/galleries/galleriesSelectors";

import {
    getReviewsByInstitution,
    deleteReview
} from "../../features/reviews/reviewsSlice";

import {
    selectReviews, selectReviewsLoadingDelete
} from "../../features/reviews/reviewsSelector";

import { BASE_URL } from "../../globalConst";
import ReviewCard from "../../components/Commets/ReviewCard";

const AdminPageInstitutionsInfo = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const institution = useAppSelector(selectInstitution);
    const loading = useAppSelector(selectInstitutionByIdLoading);
    const loadingDeletePhoto = useAppSelector(selectGalleriesLoadingDelete);
    const loadingDeleteReview = useAppSelector(selectReviewsLoadingDelete);

    const galleries = useAppSelector(selectGalleries);
    const galleriesLoading = useAppSelector(selectGalleriesLoadingGet);

    const reviews = useAppSelector(selectReviews);

    useEffect(() => {
        if (id) {
            dispatch(getInfoByInstitution({ id }));
            dispatch(getGalleriesByInstitution(id));
            dispatch(getReviewsByInstitution(id));
        }
    }, [id, dispatch]);

    const deletePhotoHandler = async (photoId: string) => {
        await dispatch(deleteGalleriesPhoto(photoId));
        if (id) dispatch(getGalleriesByInstitution(id));
    };

    const deleteReviewHandler = async (reviewId: string) => {
        await dispatch(deleteReview(reviewId));
        if (id) dispatch(getReviewsByInstitution(id));
    };

    if (loading || !institution) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {loadingDeletePhoto || loadingDeleteReview && <LinearProgress />}
            <Card sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={`${BASE_URL}/${institution.image}`}
                    alt={institution.title}
                />

                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {institution.title}
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {institution.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Rating value={institution.avgRating} precision={0.1} readOnly />
                        <Typography>
                            {institution.avgRating.toFixed(1)} / 5
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Gallery
                    </Typography>

                    {galleriesLoading ? (
                        <CircularProgress />
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                                gap: 2,
                                mb: 4,
                            }}
                        >
                            {galleries.map(photo => (
                                <Box key={photo._id} sx={{ position: "relative" }}>
                                    <img
                                        src={`${BASE_URL}/${photo.image}`}
                                        alt="gallery"
                                        style={{
                                            width: "100%",
                                            height: "150px",
                                            objectFit: "cover",
                                            borderRadius: 8,
                                        }}
                                    />

                                    <IconButton
                                        onClick={() => deletePhotoHandler(photo._id)}
                                        sx={{
                                            position: "absolute",
                                            top: 5,
                                            right: 5,
                                            background: "rgba(0,0,0,0.6)",
                                            color: "white",
                                            "&:hover": { background: "rgba(255,0,0,0.8)" }
                                        }}
                                        size="small"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Reviews
                    </Typography>

                    {reviews.length === 0 ? (
                        <Typography color="text.secondary">
                            No reviews yet
                        </Typography>
                    ) : (
                        reviews.map(review => (
                            <Box key={review._id} sx={{ position: "relative" }}>
                                <ReviewCard review={review} />

                                <IconButton
                                    onClick={() => deleteReviewHandler(review._id)}
                                    sx={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                    }}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default AdminPageInstitutionsInfo;