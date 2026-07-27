import yup from "@/yup.jp";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField } from "@mui/material";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

type SimpleFormValidation = yup.ObjectSchema<{
    id: number,
    value: string | undefined;
}, yup.AnyObject, {
    id: undefined,
    value: undefined;
}, "">;

type FormValues = {
    id: number,
    value?: string,
};

type SimpleFormProps = {
    label: string,
    id: number,
    value?: string,
    validation: SimpleFormValidation,
    update: ({ id, value }: FormValues) => Promise<boolean>,
};

export default function SimpleOptionalMultipleTextForm({ label, id, value, validation, update }: SimpleFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validation),
    });

    //#region フォームのSubmit・Changeイベントにおけるvalueの更新処理
    const timeoutIdForUpdating = useRef<NodeJS.Timeout>(setTimeout(() => null));

    function submit(event: React.SubmitEvent) {
        function onValid(formData: FormValues) {
            clearTimeout(timeoutIdForUpdating.current);
            // console.log({ old: timeoutId.current });

            const response = update(formData);
            // console.log("onSubmit");
            showLabelMessage(response);
        }
        const processHandler = handleSubmit(onValid);
        processHandler(event);
    }

    function change(event: React.ChangeEvent) {
        function onValid(formData: FormValues) {
            const timeout = 3000;
            const newTimeoutId = setTimeout(() => {
                const response = update(formData);
                // console.log("onChange");
                showLabelMessage(response);
            }, timeout);
            // console.log({ old: timeoutId.current, new: newTimeoutId });
            clearTimeout(timeoutIdForUpdating.current);
            timeoutIdForUpdating.current = newTimeoutId;
        }
        const processHandler = handleSubmit(onValid);
        processHandler(event);
    }
    //#endregion

    //#region value更新時のlabel制御
    const [labelWithMessage, setLabelWithMessage] = useState<string>(label);
    const timeoutIdForLabel = useRef<NodeJS.Timeout>(setTimeout(() => null));
    function showLabelMessage(response: Promise<boolean>) {
        response.then(isSuccessful => {
            setLabelWithMessage(() => {
                clearTimeout(timeoutIdForLabel.current);
                const timeout = 3000;
                timeoutIdForLabel.current = setTimeout(() => {
                    setLabelWithMessage(label);
                }, timeout);
                const status = isSuccessful ? "saved" : "failed to save";
                return `${label}(${status})`;
            });
        });
    }
    //#endregion

    const valueAttributes = {
        label: labelWithMessage,
        type: "text",
        ...register("value"),
        error: "value" in errors,
        helperText: errors.value?.message,
        defaultValue: value,
    };

    return (
        <form onSubmit={submit} onChange={change}>
            <input type="hidden" value={id} {...register("id")} />
            <TextField margin="normal" {...valueAttributes} />
        </form>
    );
}