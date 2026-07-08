import yup, { HALF_WIDTH_ALPHANUMERIC_CHARACTERS } from "@/yup.jp";
import testEmailDuplicate from "./test-email-dupulicate";

const newUserValidation = yup.object({
    name: yup
        .string()
        .label("ユーザ名")
        .required()
        .max(100),
    email: yup
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
    tell: yup
        .string()
        .label("Tell")
        .required()
        .max(100),
    password: yup
        .string()
        .label("Password")
        .required()
        .min(15)
        .max(100)
        .matches(HALF_WIDTH_ALPHANUMERIC_CHARACTERS),
});

export default newUserValidation;