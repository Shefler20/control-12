import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {getInstitutions} from "../../features/institutions/institutionsSlice.ts";
import {selectInstitutions, selectInstitutionsLoading} from "../../features/institutions/institutionsSelector.ts";
import {Box, LinearProgress, Typography} from "@mui/material";
import InstitutionCard from "../../components/InstitutionCard/InstitutionCard.tsx";

const Home = () => {
    const dispatch = useAppDispatch();
    const institutions = useAppSelector(selectInstitutions);
    const loadingGetInstitutions = useAppSelector(selectInstitutionsLoading);

    useEffect(() => {
        dispatch(getInstitutions());
    }, [dispatch]);
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
                        <InstitutionCard
                            key={institution._id}
                            institution={institution}
                        />
                    ))}
                </Box>
            )}
        </>
    );
};

export default Home;