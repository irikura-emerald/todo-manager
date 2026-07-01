"use client"

import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { TextField } from "@mui/material";

type TextFieldProps<T> = Readonly<{
    label: string,
    name: string,
    type: string,
    register: UseFormRegister<T extends FieldValues ? T : any>,
    errors: FieldErrors<FieldValues>
}>;

export default function SimpleTextField<T>({ label, name, type, register, errors }: TextFieldProps<T>) {
    const attributes = {
        label,
        type,
        ...register(name as Path<T extends FieldValues ? T : any>),
        error: name in errors,
        helperText: errors[name]?.message as string | undefined,
    };
    return (
        <TextField margin="normal" {...attributes} />
    );
}