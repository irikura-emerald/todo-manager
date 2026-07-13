"use client"

import { getAuthenticatedUser, updateName } from "@/lib/user-control";
import { nameValidation } from "@/validation/update-user-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const label = "Name";
const type = "text";
const column = "name";
const autoComplete = "name";
const validation = nameValidation;
const updateColumn = updateName;

export default function NameForm() {
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