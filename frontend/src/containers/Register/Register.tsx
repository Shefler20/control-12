import {Avatar, Box, Button, CircularProgress, Container, Grid, TextField, Typography} from "@mui/material";
import {useState} from "react";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {registerErrorSelector, registerLoadingSelector} from "../../features/users/usersSelectors.ts";
import {googleLogin, register} from "../../features/users/usersSlice.ts";
import FileInput from "../../UI/FileInput.tsx";
import * as React from "react";
import {GoogleLogin} from "@react-oauth/google";
import {toast} from "react-toastify";


const Register = () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(registerErrorSelector);
    const loadingRegister = useAppSelector(registerLoadingSelector);
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterMutation>({
        username: "",
        password: "",
        avatar: null,
        displayName: "",
    });

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setForm(prevState => ({...prevState, [name]: value }));
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
          await dispatch(register(form)).unwrap();
          setForm({
              username: "",
              password: "",
              avatar: null,
              displayName: "",
          });
          navigate("/");
      } catch (e) {
          console.log(e);
      }
    };

    const getFieldError = (fieldError: string) => {
        try {
            return error?.errors[fieldError].message ;
        }catch {
            return undefined;
        }
    };

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files){
            setForm(prevState => ({...prevState, [name]: files[0]}));
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
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={onSubmitHandler} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid size={{xs: 12}}>
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
                                        error={Boolean(getFieldError("username"))}
                                        helperText={getFieldError("username")}
                                        disabled={loadingRegister}
                                    />
                                </Grid>
                                <Grid size={{xs: 12}}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="displayName"
                                        required
                                        fullWidth
                                        id="displayName"
                                        label="Your name of the user"
                                        autoFocus
                                        value={form.displayName}
                                        onChange={onInputChange}
                                        error={Boolean(getFieldError("displayName"))}
                                        helperText={getFieldError("displayName")}
                                        disabled={loadingRegister}
                                    />
                                </Grid>
                                <Grid size={{xs: 12}}>
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
                                        error={Boolean(getFieldError("password"))}
                                        helperText={getFieldError("password")}
                                        disabled={loadingRegister}
                                    />
                                </Grid>
                                <Grid size={{xs: 12}}>
                                    <FileInput name="avatar" label="Avatar" value={form.avatar} onChange={fileInputChangeHandler}/>
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loadingRegister ? <CircularProgress/> : "Sign Up"}
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
                                    <Link to='/login'>
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
        </>
    );
};

export default Register;