import { testTodoListOwner } from "@/lib/todolist-control";
import yup from "@/yup.jp";

export const todoListCreateValidation = yup.object({
    name: yup
        .string()
        .label("リスト名")
        .required()
        .max(100),
});

function getTodoListUpdateValidation(isForServer: boolean) {
    return yup.object({
        id: yup
            .number()
            .label("リストID")
            .required()
            .test({
                name: "todolist-owner-test",
                message: ({ label }: { label: string }) => `この${label}は存在しません。`,
                test: isForServer ? testTodoListOwner : () => true,
            }),
        value: yup
            .string()
            .label("リスト名")
            .required()
            .max(100),
    });
}
export const todoListUpdateValidationForClient = getTodoListUpdateValidation(false);
export const todoListUpdateValidationForServer = getTodoListUpdateValidation(true);
