"use client"

import { getAuthenticatedUser, updateEmail } from "@/lib/user-control";
import { emailValidation } from "@/validation/update-user-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const label = "Email";
const type = "email";
const column = "email";
const autoComplete = "email";
const validation = emailValidation;
const updateColumn = updateEmail;

export default function EmailForm() {
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const [message, setMessage] = useState<string>("読み込み中…");

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validation),
    });

    function loadFromDataBase() {
        getAuthenticatedUser(column)
            .then(user => {
                if (!user) {
                    setMessage(`${label}の読み込みに失敗しました。`);
                    return;
                }
                const defaultValue = user?.[column] as unknown as string;
                setValue("value", defaultValue);
                // console.log(defaultValue);
                setIsFormValid(true);
                setMessage("");
            });
    };
    useEffect(loadFromDataBase, [setValue]);

    const attributes = {
        label,
        type,
        ...register("value"),
        error: column in errors,
        helperText: errors.value?.message as string | undefined,
        autoComplete,
        defaultValue: "----",
        disabled: !isFormValid,
    };

    async function update({ value }: { value: string }) {
        const isContinued = confirm(`${label}を変更する場合、セッション情報を更新するためログアウトします。\n変更しますか？`);
        if (!isContinued) {
            return;
        }

        setIsFormValid(false);
        setMessage("変更中…");
        const isSuccessful = await updateColumn(value);
        setMessage(isSuccessful ? "変更に成功しました。ログアウトします…" : "変更に失敗しました。");
        signOut();
    }

    return (
        <div>
            <form onSubmit={handleSubmit(update)}>
                <TextField margin="normal" {...attributes} />
                <Button variant="contained" type="submit" disabled={!isFormValid}>変更</Button>
            </form>
            <div>{message}</div>
        </div>
    );
}