import yup from "@/yup.jp";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";

type FieldValues<T> = {
    id?: number,
    value?: T,
};

type TransformedValues<T> = {
    id: number,
    value: T,
};

export type SimpleFormValidation<T> = yup.ObjectSchema<
    TransformedValues<T>,
    yup.AnyObject,
    {
        id: undefined,
        value: undefined;
    },
    ""
>;

export type SimpleFormRenderProps<T> = {
    labelWithMessage: string,
    register: UseFormRegister<TransformedValues<T>>,
    errors: FieldErrors<TransformedValues<T>>,
};

type SimpleFormBaseProps<T> = {
    label: string,
    id: number,
    value: T,
    validation: SimpleFormValidation<T>,
    update: ({ id, value }: FieldValues<T>) => Promise<boolean>,
    render: ({ labelWithMessage, register, errors }: SimpleFormRenderProps<T>) => React.ReactNode,
};

export type SimpleFormProps<T> = Omit<SimpleFormBaseProps<T>, "render">;

export default function SimpleFormBase<T>({ label, id, value, validation, update, render }: SimpleFormBaseProps<T>) {
    const { register, handleSubmit, formState: { errors } } = useForm<
        TransformedValues<T>,
        undefined,
        FieldValues<T>
    >({
        resolver: yupResolver(validation),
        defaultValues: { id, value },
    });

    //#region フォームのSubmit・Changeイベントにおけるvalueの更新処理
    const timeoutIdForUpdating = useRef<NodeJS.Timeout>(setTimeout(() => null));

    function submit(event: React.SubmitEvent) {
        function onValid(formData: FieldValues<T>) {
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
        function onValid(formData: FieldValues<T>) {
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

    return (
        <form onSubmit={submit} onChange={change}>
            <input type="hidden" {...register("id")} />
            {
                render({ labelWithMessage, register, errors })
            }
        </form>
    );
}