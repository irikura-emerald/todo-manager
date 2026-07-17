import yup from "@/yup.jp";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

export type SimpleValidation = yup.ObjectSchema<{
    id: number,
    value: string;
}, yup.AnyObject, {
    id: undefined,
    value: undefined;
}, "">;

type SimpleFormProps = {
    label?: string,
    type: string,
    id: number,
    value: string,
    validation: SimpleValidation,
    update: ({ id, value }: { id: number, value: string }) => void,
};

type FormValues = {
    id: number,
    value: string,
};

export default function SimpleForm({ label, type, id, value, validation, update }: SimpleFormProps) {
    const { register, handleSubmit, setValues, getValues, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(validation),
    });

    const formData = getValues();
    if (!formData.id && !formData.value) {
        setValues({ id, value });
    }

    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

    function submit(formData: FormValues) {
        clearTimeout(timeoutId);
        console.log(timeoutId);
        update(formData);
        // console.log("onSubmit");
    }

    function change(formData: FormValues) {
        const timeout = 3000;
        const newTimeoutId = setTimeout(() => {
            update(formData);
            // console.log("onChange");
        }, timeout);
        setTimeoutId(oldTimeoutId => {
            // console.log({ old: oldTimeoutId, new: newTimeoutId });
            clearTimeout(oldTimeoutId);
            return newTimeoutId;
        });
    }

    const valueAttributes = {
        label,
        type,
        ...register("value"),
        error: "value" in errors,
        helperText: errors.value?.message,
    }

    return (
        <form onSubmit={handleSubmit(submit)} onChange={handleSubmit(change)}>
            <input type="hidden" {...register("id")} />
            <TextField margin="normal" {...valueAttributes} />
        </form>
    );
}