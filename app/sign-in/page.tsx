"use client"

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import yup from "@/yup.jp";
import SimpleTextField from "@/components/SimpleTextField";

const schema = yup.object({
    email: yup
        .string()
        .label("Email")
        .required()
        .email(),
    password: yup
        .string()
        .label("Password")
        .required()
        .max(100),
});

// TODO デバッグ用。後で必ず消す！
const outputLog = (data: { email: string, password: string }) => console.log(data);

export default function SignInPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const basicAttributes = {
        register,
        errors,
    };

    const emailAttributes = {
        label: "Email",
        name: "email",
        type: "email",
        ...basicAttributes
    };

    const passwordAttributes = {
        label: "Password",
        name: "password",
        type: "password",
        ...basicAttributes
    };

    return (
        <form onSubmit={handleSubmit(outputLog)} noValidate>
            <div>
                <SimpleTextField {...emailAttributes} />
            </div>
            <div>
                <SimpleTextField {...passwordAttributes} />
            </div>
            <div>
                <Button variant="contained" type="submit">ログイン</Button>
            </div>
        </form>
    );
}
