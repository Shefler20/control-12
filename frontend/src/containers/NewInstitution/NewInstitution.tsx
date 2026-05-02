import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import {addInstitution} from "../../features/institutions/institutionsSlice.ts";
import FileInput from "../../UI/FileInput.tsx";
import { FormControlLabel, Checkbox } from "@mui/material";
import { z } from "zod";
import {selectInstitutionSendLoading} from "../../features/institutions/institutionsSelector.ts";

export const institutionSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title is too long"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description is too long"),

    image: z
        .any()
        .refine((file) => file !== null, "Image is required"),

    agreeToTerms: z
        .boolean()
        .refine((val) => val === true, "You must agree to the terms"),
});


const NewInstitution = () => {
    const loadingAdd = useAppSelector(selectInstitutionSendLoading);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState<InstitutionMutation>({
        title: "",
        description: "",
        image: null,
        agreeToTerms: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = institutionSchema.safeParse(form);

            if (!result.success) {
                const fieldErrors: Record<string, string> = {};

                result.error.issues.forEach(error => {
                    const field = error.path[0];
                    if (field) {
                        fieldErrors[field as string] = error.message;
                    }
                });
                setErrors(fieldErrors);
                return;
            }
            setErrors({});
            await dispatch(addInstitution(form)).unwrap();

            setForm({
                title: "",
                description: "",
                image: null,
                agreeToTerms: false,
            });
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    const changeField = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevState => ({...prevState, [name]: value}));
    }

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files){
            setForm(prevState => ({...prevState, [name]: files[0]}));
        }
    };

    const checkboxChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    return (
        <Box
            component="form"
            onSubmit={submitHandler}
            sx={{
                maxWidth: 500,
                mx: "auto",
                mt: 5,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Typography variant="h5">Create Institution</Typography>

            <TextField
                name="title"
                label="Title"
                value={form.title}
                onChange={changeField}
                required
                error={!!errors.title}
                helperText={errors.title}
                disabled={loadingAdd}
            />

            <TextField
                name="description"
                label="Description"
                value={form.description}
                onChange={changeField}
                multiline
                rows={4}
                required
                error={!!errors.description}
                helperText={errors.description}
                disabled={loadingAdd}
            />

            <FileInput
                name="image"
                label="Image"
                value={form.image}
                onChange={fileInputChangeHandler}
            />
            {errors.image && (
                <Typography color="error" variant="caption">
                    {errors.image}
                </Typography>
            )}
            <FormControlLabel
                control={
                    <Checkbox
                        name="agreeToTerms"
                        checked={form.agreeToTerms}
                        onChange={checkboxChangeHandler}
                        color="primary"
                    />
                }
                label={
                    <Typography variant="body2">
                        I agree to the{" "}
                        <Typography
                            component="span"
                            sx={{ fontWeight: 600, color: "primary.main", cursor: "pointer" }}
                        >
                            terms and conditions
                        </Typography>
                    </Typography>
                }
            />
            <Button
                type="submit"
                variant="contained"
                disabled={loadingAdd || !form.agreeToTerms}
                startIcon={loadingAdd ? <CircularProgress size={16} /> : null}
            >
                {loadingAdd ? "Creating..." : "Create Institution"}
            </Button>
        </Box>
    );
};

export default NewInstitution;