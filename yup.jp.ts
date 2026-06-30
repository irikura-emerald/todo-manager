import * as yup from "yup";

const jpLocale: yup.LocaleObject = {
    mixed: {
        required: param => `${param.label}は必須です。`,
    },
    string: {
        max: param => `${param.label}は${param.max}文字以内にしてください。`,
        email: param => `${param.label}はメールアドレスの形式にしてください。`,
    }
};

yup.setLocale(jpLocale);

export default yup;