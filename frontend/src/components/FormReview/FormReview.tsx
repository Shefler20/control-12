import React, { useState } from "react";
import { Box, Button, TextField, Typography, Rating, CircularProgress } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import {createReview, getReviewsByInstitution} from "../../features/reviews/reviewsSlice";
import { z } from "zod";

export const reviewSchema = z.object({
    description: z
        .string()
        .min(5, "Description must be at least 5 characters")
        .max(1000, "Description is too long"),

    quality: z.number().min(1, "Rate quality"),
    service: z.number().min(1, "Rate service"),
    interior: z.number().min(1, "Rate interior"),
});

interface Props {
    institutionId: string;
    loading?: boolean;
}

const FormReview: React.FC<Props> = ({ institutionId, loading }) => {
    const dispatch = useAppDispatch();

    const [form, setForm] = useState<ReviewMutation>({
        institution: institutionId,
        description: "",
        quality: 0,
        service: 0,
        interior: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const changeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            description: e.target.value,
        }));
    };

    const changeRating = (field: "quality" | "service" | "interior") =>
        (_: React.SyntheticEvent, value: number | null) => {
            setForm(prev => ({
                ...prev,
                [field]: value ?? 0,
            }));
        };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = reviewSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach(err => {
                const field = err.path[0];
                if (field) {
                    fieldErrors[field as string] = err.message;
                }
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        await dispatch(createReview(form)).unwrap();
        dispatch(getReviewsByInstitution(institutionId));

        setForm({
            institution: institutionId,
            description: "",
            quality: 0,
            service: 0,
            interior: 0,
        });
    };

    return (
        <Box
            component="form"
            onSubmit={submitHandler}
            sx={{
                mt: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 500,
            }}
        >
            <Typography variant="h6">Leave a review</Typography>

            <TextField
                label="Description"
                multiline
                rows={3}
                value={form.description}
                onChange={changeDescription}
                error={!!errors.description}
                helperText={errors.description}
                required
            />

            <Box>
                <Typography>Quality</Typography>
                <Rating
                    value={form.quality}
                    onChange={changeRating("quality")}
                />
                {errors.quality && (
                    <Typography color="error" variant="caption">
                        {errors.quality}
                    </Typography>
                )}
            </Box>

            <Box>
                <Typography>Service</Typography>
                <Rating
                    value={form.service}
                    onChange={changeRating("service")}
                />
                {errors.service && (
                    <Typography color="error" variant="caption">
                        {errors.service}
                    </Typography>
                )}
            </Box>

            <Box>
                <Typography>Interior</Typography>
                <Rating
                    value={form.interior}
                    onChange={changeRating("interior")}
                />
                {errors.interior && (
                    <Typography color="error" variant="caption">
                        {errors.interior}
                    </Typography>
                )}
            </Box>

            <Button
                type="submit"
                variant="contained"
                disabled={loading}
            >
                {loading ? <CircularProgress size={20} /> : "Submit review"}
            </Button>
        </Box>
    );
};

export default FormReview;