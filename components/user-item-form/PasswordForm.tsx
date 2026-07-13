"use client"

import { updatePassword } from "@/lib/user-control";
import { passwordValidation } from "@/validation/update-user-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

const label = "New Password";
const type = "password";
const column = "password";
const autoComplete = "new-password";
const validation = passwordValidation;
const updateColumn = updatePassword;

export default function PasswordForm() {
    const [isFormValid, setIsFormValid] = useState<boolean>(true);

    const [message, setMessage] = useState<string>("");

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validation),
    });

    const attributes = {
        label,
        type,
        ...register("value"),
        error: column in errors,
        helperText: errors.value?.message as string | undefined,
        autoComplete,
        disabled: !isFormValid,
    };

    async function update({ value }: { value: string }) {
        setIsFormValid(false);
        setMessage("変更中…");
        const isSuccessful = await updateColumn(value);
        setMessage(isSuccessful ? "変更に成功しました。" : "変更に失敗しました。");
        setIsFormValid(true);
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