import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    Rating,
    Divider,
    Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { getInfoByInstitution } from "../../features/institutions/institutionsSlice";
import {
    selectInstitution,
    selectInstitutionByIdLoading
} from "../../features/institutions/institutionsSelector.ts";

import {
    addGalleriesPhoto,
    getGalleriesByInstitution
} from "../../features/galleries/galleriesSlice.ts";

import {
    selectGalleries,
    selectGalleriesLoadingGet, selectGalleriesLoadingSend
} from "../../features/galleries/galleriesSelectors.ts";

import { BASE_URL } from "../../globalConst.ts";
import FileInput from "../../UI/FileInput.tsx";
import FormReview from "../../components/FormReview/FormReview.tsx";
import {
    selectReviews, selectReviewsCheck, selectReviewsLoadingGet,
    selectReviewsLoadingSend
} from "../../features/reviews/reviewsSelector.ts";
import {checkUserReview, getReviewsByInstitution} from "../../features/reviews/reviewsSlice.ts";
import ReviewCard from "../../components/Commets/ReviewCard.tsx";
import {userSelector} from "../../features/users/usersSelectors.ts";

const DetailInstitutionInfo = () => {
    const { id } = useParams<{ id: string }>();
    const user = useAppSelector(userSelector);
    const dispatch = useAppDispatch();

    const institution = useAppSelector(selectInstitution);
    const loading = useAppSelector(selectInstitutionByIdLoading);
    const reviewLoading = useAppSelector(selectReviewsLoadingSend);
    const hasSeeForm = useAppSelector(selectReviewsCheck);
    const reviews = useAppSelector(selectReviews);
    const loadingReviews = useAppSelector(selectReviewsLoadingGet);
    const loadingSendPhoto = useAppSelector(selectGalleriesLoadingSend);

    const galleries = useAppSelector(selectGalleries);
    const galleriesLoading = useAppSelector(selectGalleriesLoadingGet);

    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(getInfoByInstitution({ id }));
            dispatch(getGalleriesByInstitution(id));
            dispatch(checkUserReview(id));
            dispatch(getReviewsByInstitution(id));
        }
    }, [id, dispatch]);

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setImage(files[0]);
        }
    };

    const addPhotoHandler = async () => {
        if (!id || !image) return;

        await dispatch(addGalleriesPhoto({
            institution: id,
            image
        })).unwrap();

        setImage(null);

        dispatch(getGalleriesByInstitution(id));
        dispatch(getInfoByInstitution({ id }));
    };

    if (loading || !institution || loadingReviews) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
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

                <Typography variant="body2" color="text.secondary">
                    💬 {institution.reviewsCount} reviews • 📷 {institution.photosCount} photos
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography>Quality: {institution.avgQuality.toFixed(1)}</Typography>
                    <Typography>Service: {institution.avgService.toFixed(1)}</Typography>
                    <Typography>Interior: {institution.avgInterior.toFixed(1)}</Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 2 }}>
                    Gallery
                </Typography>

                {galleriesLoading ? (
                    <CircularProgress />
                ) : galleries.length === 0 ? (
                    <Typography color="text.secondary">
                        No photos yet
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        {galleries.map(photo => (
                            <Box
                                key={photo._id}
                                sx={{
                                    overflow: "hidden",
                                    borderRadius: 2,
                                }}
                            >
                                <img
                                    src={`${BASE_URL}/${photo.image}`}
                                    alt="gallery"
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover",
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                )}

                {user && <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <FileInput
                        name="image"
                        label="Image"
                        value={image}
                        onChange={fileInputChangeHandler}
                    />

                    <Button
                        variant="contained"
                        onClick={addPhotoHandler}
                        disabled={!image}
                    >
                        {loadingSendPhoto ? <CircularProgress /> : "Add Photo"}
                    </Button>
                </Box>}

                <Divider sx={{ my: 3 }} />

                {!hasSeeForm && user &&  <FormReview
                    institutionId={id!}
                    loading={reviewLoading}
                />}
                {!loadingReviews && reviews.length === 0 && <Typography variant="h6" sx={{mt:3, textAlign: "center"}}>No Review yet</Typography>}
                {reviews.length > 0 && (
                    reviews.map((review) => (
                        <ReviewCard key={review._id} review={review}/>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default DetailInstitutionInfo;