import {Alert, Avatar, Box, Button, CircularProgress, Container, Grid, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {loginErrorSelector, loginLoadingSelector,} from "../../features/users/usersSelectors.ts";
import {googleLogin, login} from "../../features/users/usersSlice.ts";
import {LockOpen} from "@mui/icons-material";
import {GoogleLogin} from "@react-oauth/google";
import {toast} from "react-toastify";


const Login = () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(loginErrorSelector);
    const loadingLogin = useAppSelector(loginLoadingSelector);
    const navigate = useNavigate();

    const [form, setForm] = useState<LoginMutation>({
        username: "",
        password: "",
    });

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prevState => ({...prevState, [name]: value }));
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await dispatch(login(form)).unwrap();
            setForm({
                username: "",
                password: "",
            });
            navigate("/");
        } catch (e) {
            console.log(e);
        }
    };

    const googleLoginHandler = async (credential: string) => {
        await dispatch(googleLogin(credential)).unwrap();
        navigate("/");
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOpen />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>

                    {error && <Alert severity="error" sx={{mt: 3, width:"100%"}}>{error.error}</Alert>}

                    <Box component="form" noValidate onSubmit={onSubmitHandler} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    autoComplete="given-name"
                                    name="username"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoFocus
                                    value={form.username}
                                    onChange={onInputChange}
                                    disabled={loadingLogin}
                                />
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={onInputChange}
                                    disabled={loadingLogin}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loadingLogin ? <CircularProgress/> : "Sign Up"}
                        </Button>
                        <Box sx={{py:2}}>
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    if (credentialResponse.credential) {
                                        googleLoginHandler(credentialResponse.credential);
                                    }
                                }}
                                onError={() => toast.error('Google Login failed.')}
                            />
                        </Box>
                        <Grid container sx={{justifyContent: "flex-end"}}>
                            <Grid>
                                <Link to='/register'>
                                    Or sing up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Login;