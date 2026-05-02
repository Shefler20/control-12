import {Box, LinearProgress, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectInstitutions, selectInstitutionsLoading} from "../../features/institutions/institutionsSelector.ts";
import {useEffect} from "react";
import {deleteInstitution, getInstitutions} from "../../features/institutions/institutionsSlice.ts";
import AdminCardInstitution from "../../components/AdminCardInsitution/AdminCardInsitution.tsx";



const AdminPageInstitutions = () => {
    const dispatch = useAppDispatch();
    const institutions = useAppSelector(selectInstitutions);
    const loadingGetInstitutions = useAppSelector(selectInstitutionsLoading);

    useEffect(() => {
        dispatch(getInstitutions());
    }, [dispatch]);

    const onDelete = async (id: string) => {
        await dispatch(deleteInstitution({id}));
        await dispatch(getInstitutions());
    }
    return (
        <>
            {loadingGetInstitutions && <LinearProgress/>}
            {!loadingGetInstitutions && institutions.length === 0 && <Typography variant="h6" sx={{mt:3, textAlign: "center"}}>No Institutions yet</Typography>}
            {institutions.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        mt: 4,
                        flexWrap: "wrap",
                    }}
                >
                    {institutions.map((institution) => (
                        <AdminCardInstitution
                            key={institution._id}
                            institution={institution}
                            onDelete={onDelete}
                        />
                    ))}
                </Box>
            )}
        </>
    );
};

export default AdminPageInstitutions;