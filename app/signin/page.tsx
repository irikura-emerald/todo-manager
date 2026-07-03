"use client"

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { signIn, SignInOptions } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import signInSchema from "@/schemas/signin-schema";

export default function SignInPage() {
    const router = useRouter();
    const [message, setMessage] = useState<string>();
    const [isFormValid, setIsFormValid] = useState<boolean>(true);

    const signInUsingCredentials = async (formData: { email: string, password: string }) => {
        const provider = "credentials";
        const options: SignInOptions<false> = {
            redirect: false,
            ...formData,
        };

        setIsFormValid(false);
        setMessage("ログイン処理中です...");

        const response = await signIn(provider, options);
        // console.log(response);

        if (!response?.error) {
            setMessage("ログインに成功しました。TODO管理ページへ移動します。");
            router.push("/");
        } else if (response.error === "Configuration") {
            setIsFormValid(true);
            setMessage("EmailかPasswordが違います。");
        } else {
            setMessage("想定外のエラーが発生しました。");
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signInSchema),
    });

    const emailAttributes = {
        label: "Email",
        type: "email",
        ...register("email"),
        error: "email" in errors,
        helperText: errors.email?.message,
    };

    const passwordAttributes = {
        label: "Password",
        type: "password",
        ...register("password"),
        error: "password" in errors,
        helperText: errors.password?.message,
    };

    return (
        <>
            <form onSubmit={handleSubmit(signInUsingCredentials)} method="POST" noValidate>
                <div>
                    <TextField margin="normal" {...emailAttributes} />
                </div>
                <div>
                    <TextField margin="normal" {...passwordAttributes} />
                </div>
                <div>
                    <Button variant="contained" type="submit" disabled={!isFormValid}>ログイン</Button>
                </div>
            </form>
            <div>{message}</div>
        </>
    );
}
