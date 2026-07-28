import { TextField } from "@mui/material";
import SimpleFormBase, { SimpleFormRenderProps, SimpleFormProps } from "./SimpleFormBase";

type ValueType = string;
export default function SimpleTextForm(props: SimpleFormProps<ValueType>) {
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