import yup from "@/yup.jp";

const todoListCreateValidation = yup.object({
    name: yup
        .string()
        .label("リスト名")
        .required()
        .max(100),
});

export default todoListCreateValidation;