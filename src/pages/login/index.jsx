import { Typography, Box, useTheme, TextField, Container, Button, } from "@mui/material";
import { tokens } from "../../theme";
import React, { useEffect } from "react"
import logo from "../../assets/logo.png"
import Topbar from "../global/Topbar";
import { login } from "../../services/userServices"
import { useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useMutation } from '@tanstack/react-query'



const Login = () => {
    const theme = useTheme('light');
    const colors = tokens(theme.palette.mode);

    const session = localStorage.getItem("session");

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem('session', data.session);
            localStorage.setItem('username', data.user.User_ID);
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + 1);
            localStorage.setItem('expiration', expiration.toISOString());
            window.location = "/";
        },
        onError: (error) => {
            console.log("Login Error", error);
        }
    })

    useEffect(() => {
        if (session) {
            window.location = "/";
        }
    }, [session]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (enteredData) => {
        const apiData = {
            Branch_ID: '',
            User_ID: enteredData.username,
            Password: enteredData.password,
        };

        mutation.mutate(apiData);


    };
    return (

        <Container component="main" color={colors.primary} >
            <Topbar />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <img src={logo} width="500px" alt="Logo" />
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>

                    {mutation.isError && (<Stack spacing={2} m={5}>
                        <Alert severity="error">{mutation.error.status === 401 ? "Invalid user name or password!" : mutation.error?.message}</Alert>
                    </Stack>)}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="CBS Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        {...register('username', {
                            required: 'Username is required',
                            minLength: {
                                value: 4,
                                message: 'Username must be at least 4 characters',
                            },
                        })}
                        error={Boolean(errors.username)}
                        helperText={errors.username?.message}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"

                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 4,
                                message: 'Password must be at least 4 characters',
                            },
                        })}
                        error={Boolean(errors.username)}
                        helperText={errors.username?.message}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={mutation.isPending}

                        color="secondary"
                    >
                        {mutation.isPending ? 'Authenticating ....' : "Sign In"}
                    </Button>


                </Box>
            </Box>

        </Container>
    );
}

export default Login;