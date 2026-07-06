import yup from "@/yup.jp";

const signInValidation = yup.object({
    email: yup
        .string()
        .label("Email")
        .required()
        .email(),
    password: yup
        .string()
        .label("Password")
        .required()
        .max(100),
});

export default signInValidation;