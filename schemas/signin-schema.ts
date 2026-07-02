import yup from "@/yup.jp";

const signInSchema = yup.object({
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

export default signInSchema;