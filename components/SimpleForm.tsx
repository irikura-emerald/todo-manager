import yup from "@/yup.jp";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField } from "@mui/material";
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
    update: ({ value }: { id: number, value: string }) => void,
};

export default function SimpleForm({ label, type, id, value, validation, update }: SimpleFormProps) {
    const { register, handleSubmit, setValues, formState: { errors } } = useForm<{ id: number, value: string }>({
        resolver: yupResolver(validation),
    });

    setValues({ id, value });

    const valueAttributes = {
        label,
        type,
        ...register("value"),
        error: "value" in errors,
        helperText: errors.value?.message,
    }

    return (
        <form onSubmit={handleSubmit(update)}>
            <input type="hidden" {...register("id")} />
            <TextField margin="normal" {...valueAttributes} />
        </form>
    );
}