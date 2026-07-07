"use client"

import newUserValidation from "@/validation/new-user-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { signIn, SignInOptions } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewUserPage() {
    const router = useRouter();
    const [message, setMessage] = useState<string>();
    const [isFormValid, setIsFormValid] = useState<boolean>(true);

    const signUpUsingCredentials = async (formData: { email: string, password: string }) => {
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
        resolver: yupResolver(newUserValidation),
    });

    return (
        <form>
            <div>
                <TextField margin="normal" />
            </div>
            <div>
                <TextField margin="normal" />
            </div>
            <div>
                <TextField margin="normal" />
            </div>
            <div>
                <TextField margin="normal" />
            </div>
            <div>
                <TextField margin="normal" />
            </div>
            <div>
                <Button variant="contained" type="submit">新規登録</Button>
            </div>
        </form>
    );
}