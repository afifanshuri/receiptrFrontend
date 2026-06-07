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
import { toast } from "sonner";
import { handleRegister } from "../service/authService";

const RegisterScreen = () => {
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [phone, setPhone] = useState('');

    const onHandleRegister = () => {
        try {
            const response = handleRegister(email, password, fname, lname, phone);
            if (response.statusCode === "DUPLICATE") {
                toast.error("Email already exists. Please use a different email.");
            } else {
                toast.success("Registration successful! Please log in.");
                nav("/login");
            }
        } catch (error) {
            toast.error("Registration failed. Please try again.");
        }
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
                                <Input id="email" required autoComplete="off" placeholder="user@mail.com" type="email" onChange={(e) => setEmail(e.target.value)} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input id="password" required autoComplete="off" type="password" onChange={(e) => setPassword(e.target.value)} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="fname">First Name</FieldLabel>
                                <Input id="fname" required autoComplete="off" type="text" onChange={(e) => setFname(e.target.value)} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="lname">Last Name</FieldLabel>
                                <Input id="lname" required autoComplete="off" type="text" onChange={(e) => setLname(e.target.value)} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                                <Input id="phone" autoComplete="off" type="tel" onChange={(e) => setPhone(e.target.value)} />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </CardContent>
                <CardFooter className="loginFooter">
                    <Button id="loginButton" onClick={() => { onHandleRegister() }}>Register</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default RegisterScreen;