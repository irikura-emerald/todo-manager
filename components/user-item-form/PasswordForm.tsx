"use client"

import { updatePassword } from "@/lib/user-control";
import { passwordValidation } from "@/validation/update-user-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function PasswordForm() {
    const [isFormValid, setIsFormValid] = useState<boolean>(true);

    const [message, setMessage] = useState<string>("");

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(passwordValidation),
    });

    const currentPasswordAttributes = {
        label: "Current Password",
        type: "password",
        ...register("currentPassword"),
        error: "currentPassword" in errors,
        helperText: errors.currentPassword?.message as string | undefined,
        autoComplete: "current-password",
        disabled: !isFormValid,
    };

    const newPasswordAttributes = {
        label: "New Password",
        type: "password",
        ...register("newPassword"),
        error: "newPassword" in errors,
        helperText: errors.newPassword?.message as string | undefined,
        autoComplete: "new-password",
        disabled: !isFormValid,
    };

    async function update(passwords: { currentPassword: string, newPassword: string }) {
        setIsFormValid(false);
        setMessage("変更中…");
        const isSuccessful = await updatePassword(passwords);
        setMessage(isSuccessful ? "変更に成功しました。" : "変更に失敗しました。");
        setIsFormValid(true);
        reset();
    }

    return (
        <div>
            <form onSubmit={handleSubmit(update)}>
                <div>
                    <TextField margin="normal" {...currentPasswordAttributes} />
                </div>
                <div>
                    <TextField margin="normal" {...newPasswordAttributes} />
                </div>
                <Button variant="contained" type="submit" disabled={!isFormValid}>変更</Button>
            </form>
            <div>{message}</div>
        </div>
    );
}