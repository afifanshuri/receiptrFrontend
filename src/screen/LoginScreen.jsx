import React, { useState } from "react";
import '../styles/LoginScreenStyle.css'
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../service/authService";
import { toast } from "sonner";

const LoginScreen = () => {
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onHandleLogin = async () => {
        try {
            await handleLogin(email, password, nav);
            nav("/home");
        } catch (error) {
            toast.error("Login failed. Please try again.");
            console.error("There was an error logging in!", error);
        }
    }

    return (
        <div>
            <Card id="loginCard">
                <CardTitle>Sign In</CardTitle>
                <CardContent id="fieldContainer">
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input id="email" autoComplete="off" placeholder="user@mail.com" type="email" onChange={(e) => setEmail(e.target.value)} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input id="password" autoComplete="off" type="password" onChange={(e) => setPassword(e.target.value)} />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </CardContent>
                <CardFooter className="loginFooter">
                    <Button className="clickableButton" id="loginButton" onClick={() => { onHandleLogin() }}>Log In</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default LoginScreen;