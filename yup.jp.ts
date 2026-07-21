import * as yup from "yup";

// 半角英数字
export const HALF_WIDTH_ALPHANUMERIC_CHARACTERS = /^[0-9a-zA-Z]+$/;

const jpLocale: yup.LocaleObject = {
    mixed: {
        required: param => `${param.label}は必須です。`,
        notOneOf: param => `${param.label}は${param.originalPath}と違う値にしてください。`,
    },
    string: {
        max: param => `${param.label}は${param.max}文字以内にしてください。`,
        min: param => `${param.label}は${param.min}文字以上にしてください。`,
        email: param => `${param.label}はメールアドレスの形式にしてください。`,
        matches(param) {
            const message =
                param.regex === HALF_WIDTH_ALPHANUMERIC_CHARACTERS ? `${param.label}は半角英数字にしてください。`
                    : `${param.label}は決められた形式にしてください。`;
            return message;
        },
    },
};
yup.setLocale(jpLocale);
export default yup;