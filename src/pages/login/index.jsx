import { Typography, Box, useTheme, TextField, FormControlLabel, Checkbox, Link, Grid, Container, Button, } from "@mui/material";
import { tokens } from "../../theme";
import React, { useEffect, useState } from "react"
import logo from "../../assets/logo.png"
import Topbar from "../global/Topbar";
import { login, logout } from "../../services/userServices"
import { set, useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';



const Login = () => {
    const theme = useTheme('light');
    const colors = tokens(theme.palette.mode);
    const [otherError, setOtherError] = useState("");

    const session = localStorage.getItem("session");
    useEffect(() => {
        if(session){
            window.location = "/";
        }

    }, [session]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const apiData = {
            Branch_ID: data.branch,
            User_ID: data.username,
            Password: data.password,
        };

        try {
            var res = await login(apiData)
            if (res.status === "200") {
                window.location = "/";
                setOtherError("");
            } else {
                setOtherError("Invalid user name or password!");
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setOtherError("Invalid user name or password!");
            }
        }

    };
    return (

        <Container component="main" >
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
                {otherError && (<Stack sx={{ width: '100%' }} spacing={2} m={5}>
                    <Alert severity="error">{otherError}</Alert>
                </Stack>)}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                    <Box justifyContent="space-between">
                        <TextField
                            sx={{ pr: "10px" }}
                            margin="normal"
                            required
                            id="branch"
                            label="Branch"
                            name="branch"
                            autoComplete="branch"
                            autoFocus
                            {...register('branch', {
                                required: 'Branch is required',
                                minLength: {
                                    value: 4,
                                    message: 'Branch must be at least 4 characters',
                                },
                            })}
                            error={Boolean(errors.username)}
                            helperText={errors.username?.message}
                        />
                        <TextField
                            margin="normal"
                            required
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
                    </Box>
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
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}

                        color="secondary"
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="h5" color={colors.greenAccent[300]}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="h5" color={colors.greenAccent[300]}>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

        </Container>
    );
}

export default Login;