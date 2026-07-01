"use client"

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import yup from "@/yup.jp";
import SimpleTextField from "@/components/SimpleTextField";
import { signIn, SignInOptions } from "next-auth/react";
import { useRouter } from "next/navigation";

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

export default function SignInPage() {
    const router = useRouter();

    const signInUsingCredentials = async (formData: { email: string, password: string }) => {
        const provider = "credentials";
        const options: SignInOptions<false> = {
            redirect: false,
            ...formData,
        };
        const response = await signIn(provider, options);
        console.log(response);
        if (response?.error) {
            // エラー発生
        } else {
            router.push("/");
        }
    };

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
        <form onSubmit={handleSubmit(signInUsingCredentials)} method="POST" noValidate>
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
