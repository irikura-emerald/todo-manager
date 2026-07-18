import yup from "@/yup.jp";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField } from "@mui/material";
import { useRef } from "react";
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

    const timeoutId = useRef<NodeJS.Timeout>(setTimeout(() => null));

    function submit(event: React.SubmitEvent) {
        function onValid(formData: FormValues) {
            clearTimeout(timeoutId.current);
            console.log({ old: timeoutId.current });

            update(formData);
            console.log("onSubmit");
        }
        const processHandler = handleSubmit(onValid);
        processHandler(event);
    }

    function change(event: React.ChangeEvent) {
        function onValid(formData: FormValues) {
            const timeout = 3000;
            const newTimeoutId = setTimeout(() => {
                update(formData);
                console.log("onChange");
            }, timeout);
            console.log({ old: timeoutId.current, new: newTimeoutId });
            clearTimeout(timeoutId.current);
            timeoutId.current = newTimeoutId;
        }
        const processHandler = handleSubmit(onValid);
        processHandler(event);
    }

    const valueAttributes = {
        label,
        type,
        ...register("value"),
        error: "value" in errors,
        helperText: errors.value?.message,
    }

    return (
        <form onSubmit={submit} onChange={change}>
            <input type="hidden" {...register("id")} />
            <TextField margin="normal" {...valueAttributes} />
        </form>
    );
}