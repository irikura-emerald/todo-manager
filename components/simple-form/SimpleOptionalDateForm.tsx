import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { PickerValue } from "@mui/x-date-pickers/internals";

type FormValues = {
    id: number,
    value: Date | null,
};

type SimpleFormProps = {
    label: string,
    id: number,
    value: Date | null,
    update: ({ id, value }: FormValues) => Promise<boolean>,
};

export default function SimpleOptionalDateForm({ label, id, value, update }: SimpleFormProps) {
    //#region フォームのChangeイベントにおけるvalueの更新処理
    const timeoutIdForUpdating = useRef<NodeJS.Timeout>(setTimeout(() => null));
    function change(formData: FormValues) {
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
        format: "YYYY/MM/DD HH:mm",
        defaultValue: value ? dayjs(value) : null,
        onChange: (value: PickerValue) => {
            change({ id, value: value?.toDate() || null });
        },
    };

    return (
        <form>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
                <DateTimePicker {...valueAttributes} />
            </LocalizationProvider>
        </form>
    );
}