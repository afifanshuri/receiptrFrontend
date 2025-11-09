import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardFooter,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

const RegisterScreen = () => {
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [phone, setPhone] = useState('');

    const handleLogin = () => {
        console.log("Login button clicked" + email + " " + password);
        axios.post("http://localhost:8080/api/auth/register", {
            email: email,
            password: password,
            firstName: fname,
            lastName: lname,
            phoneNumber: phone
        }).then(response => {
            console.log("Registration successful:", response.data);
            nav("/login");
        }).catch(error => {
            console.error("There was an error during registration!", error);
        });
    }


    return (
        <div>
            <Card id="registerCard">
                <CardTitle>Register</CardTitle>
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
                            <Field>
                                <FieldLabel htmlFor="fname">First Name</FieldLabel>
                                <Input id="fname" autoComplete="off" type="text" onChange={(e) => setFname(e.target.value)} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="lname">Last Name</FieldLabel>
                                <Input id="lname" autoComplete="off" type="text" onChange={(e) => setLname(e.target.value)} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                                <Input id="phone" autoComplete="off" type="tel" onChange={(e) => setPhone(e.target.value)} />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </CardContent>
                <CardFooter className="loginFooter">
                    <Button id="loginButton" onClick={() => { handleLogin() }}>Log In</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default RegisterScreen;