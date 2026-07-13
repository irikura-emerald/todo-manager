import yup, { HALF_WIDTH_ALPHANUMERIC_CHARACTERS } from "@/yup.jp";
import testEmailDuplicate from "./test-email-dupulicate";


export type UpdateUserValidation = yup.ObjectSchema<{
    value: string;
}, yup.AnyObject, {
    value: undefined;
}, "">;

export const nameValidation: UpdateUserValidation = yup.object({
    value: yup
        .string()
        .label("ユーザ名")
        .required()
        .max(100),
});

export const emailValidation: UpdateUserValidation = yup.object({
    value: yup
        .string()
        .label("Email")
        .required()
        .email()
        .max(100)
        .test({
            name: "email-duplicate-test",
            message: ({ label }: { label: string }) => `この${label}はすでに登録済みです。`,
            test: testEmailDuplicate,
        }),
});

export const tellValidation: UpdateUserValidation = yup.object({
    value: yup
        .string()
        .label("Tell")
        .required()
        .max(100),
});

export type PasswordValidation = yup.ObjectSchema<{
    currentPassword: string;
    newPassword: string;
}, yup.AnyObject, {
    currentPassword: undefined;
    newPassword: undefined;
}, "">;
export const passwordValidation: PasswordValidation = yup.object({
    currentPassword: yup
        .string()
        .label("Current Password")
        .required()
        .max(100),
    newPassword: yup
        .string()
        .label("New Password")
        .required()
        .min(15)
        .max(100)
        .matches(HALF_WIDTH_ALPHANUMERIC_CHARACTERS)
        .notOneOf([yup.ref("currentPassword")], "同じパスワードは設定できません。"),
});