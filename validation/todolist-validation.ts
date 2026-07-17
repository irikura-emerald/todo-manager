import yup from "@/yup.jp";

export const todoListCreateValidation = yup.object({
    name: yup
        .string()
        .label("リスト名")
        .required()
        .max(100),
});
