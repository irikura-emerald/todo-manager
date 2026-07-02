"use client"

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import yup from "@/yup.jp";
import SimpleTextField from "@/components/SimpleTextField";
import { signIn, SignInOptions } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import signInSchema from "@/schemas/signin-schema";

export default function SignInPage() {
    const router = useRouter();
    const [message, setMessage] = useState<string>();

    const signInUsingCredentials = async (formData: { email: string, password: string }) => {
        const provider = "credentials";
        const options: SignInOptions<false> = {
            redirect: false,
            ...formData,
        };

        setMessage("ログイン処理中です...");

        const response = await signIn(provider, options);
        // console.log(response);

        if (!response?.error) {
            setMessage("ログインに成功しました。TODO管理ページへ移動します。");
            router.push("/");
        } else if (response.error === "Configuration") {
            setMessage("EmailかPasswordが違います。");
        } else {
            setMessage("想定外のエラーが発生しました。");
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signInSchema),
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
        <>
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
            <div>{message}</div>
        </>
    );
}
