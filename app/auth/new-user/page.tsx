"use client"

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { signIn, SignInOptions } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import newUserValidation from "@/validation/new-user-validation";
import { createNewUser } from "@/lib/user-control";

export default function NewUserPage() {
    const router = useRouter();
    const [message, setMessage] = useState<string>();
    const [isFormValid, setIsFormValid] = useState<boolean>(true);

    type FormData = {
        name: string,
        email: string,
        tell: string,
        password: string,
    };
    const signUpUsingCredentials = async (formData: FormData) => {
        // console.log(formData);

        setIsFormValid(false);

        setMessage("ユーザを新規登録中です...");
        const user = await createNewUser(formData);
        if (!user) {
            setIsFormValid(true);
            setMessage("ユーザの新規登録が失敗しました。");
        }

        setMessage("ログイン処理中です...");
        const provider = "credentials";
        const options: SignInOptions<false> = {
            redirect: false,
            email: formData.email,
            password: formData.password,
        };
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

    const nameAttributes = {
        label: "Name",
        type: "text",
        ...register("name"),
        error: "name" in errors,
        helperText: errors.name?.message,
        autoComplete: "name",
    };

    const emailAttributes = {
        label: "Email",
        type: "email",
        ...register("email"),
        error: "email" in errors,
        helperText: errors.email?.message,
        autoComplete: "email",
    };

    const tellAttributes = {
        label: "Tell",
        type: "tel",
        ...register("tell"),
        error: "tell" in errors,
        helperText: errors.tell?.message,
        autoComplete: "tel",
    };

    const passwordAttributes = {
        label: "Password",
        type: "password",
        ...register("password"),
        error: "password" in errors,
        helperText: errors.password?.message,
        autoComplete: "new-password",
    };

    return (
        <>
            <form onSubmit={handleSubmit(signUpUsingCredentials)}>
                <div>
                    <TextField margin="normal" {...nameAttributes} />
                </div>
                <div>
                    <TextField margin="normal"  {...emailAttributes} />
                </div>
                <div>
                    <TextField margin="normal"  {...tellAttributes} />
                </div>
                <div>
                    <TextField margin="normal"  {...passwordAttributes} />
                </div>
                <div>
                    <Button variant="contained" type="submit" disabled={!isFormValid}>新規登録</Button>
                </div>
            </form>
            <div>{message}</div>
        </>
    );
}