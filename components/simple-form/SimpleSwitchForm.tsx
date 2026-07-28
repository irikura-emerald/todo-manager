import { FormHelperText, Switch } from "@mui/material";
import SimpleFormBase, { SimpleFormProps, SimpleFormRenderProps } from "./SimpleFormBase";

type ValueType = boolean;
export default function SimpleSwitchForm(props: SimpleFormProps<ValueType>) {
    const render = ({ labelWithMessage, register, errors }: SimpleFormRenderProps<ValueType>) => (
        <div>
            <label>
                <Switch {...register("value")} defaultChecked={props.value} />
                {labelWithMessage}
            </label>
            <FormHelperText error={"value" in errors}>
                {errors.value?.message}
            </FormHelperText>
        </div>
    );
    return (
        <SimpleFormBase<ValueType> {...props} render={render} />
    );
}