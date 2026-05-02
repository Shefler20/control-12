import {Button, Container, Paper, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();
    return (
        <>
            <Container maxWidth="sm" sx={{ mt: 10 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                    <Stack spacing={2} sx={{ alignItems: "center" }}>
                        <Typography variant="h1" color="error">
                            404
                        </Typography>
                        <Typography variant="h5">
                            Страница не найдена
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            К сожалению, такой страницы не существует или она была удалена.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("/")}>
                            На главную
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </>
    );
};

export default PageNotFound;