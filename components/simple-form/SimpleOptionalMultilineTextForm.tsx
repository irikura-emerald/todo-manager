import { TextField } from "@mui/material";
import SimpleFormBase, { SimpleFormProps, SimpleFormRenderProps } from "./SimpleFormBase";

type ValueType = string | undefined;
export default function SimpleOptionalMultipleTextForm(props: SimpleFormProps<ValueType>) {
    const render = ({ labelWithMessage, register, errors }: SimpleFormRenderProps<ValueType>) => (
        <TextField
            margin="normal"
            label={labelWithMessage}
            type="text"
            {...register("value")}
            error={"value" in errors}
            helperText={errors.value?.message}
        />
    );
    return (
        <SimpleFormBase<ValueType> {...props} render={render} />
    );
}