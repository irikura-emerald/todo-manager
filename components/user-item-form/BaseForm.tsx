"use client"

import { getAuthenticatedUser } from "@/lib/user-control";
import { UpdateUserValidation } from "@/validation/update-user-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export type BaseFormProps = {
    label: string,
    type: string,
    column: string,
    autoComplete: string,
    validation: UpdateUserValidation,
    updateColumn: (value: string) => Promise<boolean>,
    processPreupdate?: () => boolean,
    processPostupdate?: (isSuccessful: boolean) => void,
};

export default function BaseForm({
    label, type, column, autoComplete, validation, updateColumn,
    processPreupdate = () => true,
    processPostupdate = () => null,
}: BaseFormProps) {
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const [message, setMessage] = useState<string>("読み込み中…");

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<{ value: string }>({
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
    useEffect(loadFromDataBase, [setValue, column, label]);

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
        const isUpdatable = processPreupdate();
        if (!isUpdatable) {
            return;
        }

        setIsFormValid(false);
        setMessage("変更中…");
        const isSuccessful = await updateColumn(value);
        setMessage(isSuccessful ? "変更に成功しました。" : "変更に失敗しました。");
        setIsFormValid(true);

        processPostupdate(isSuccessful);
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