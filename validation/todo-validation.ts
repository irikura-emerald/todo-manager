import { testTodoListOwner } from "@/lib/todolist-control";
import yup from "@/yup.jp";

function getTodoCreateValidation(isForServer: boolean) {
    return yup.object({
        todoListId: yup
            .number()
            .label("TODOリストID")
            .required()
            .test({
                name: "todolist-owner-test",
                message: ({ label }: { label: string }) => `この${label}は存在しません。`,
                test: isForServer ? testTodoListOwner : () => true,
            }),
        name: yup
            .string()
            .label("TODO名")
            .required()
            .max(100),
    });
}
export const todoCreateValidationForClient = getTodoCreateValidation(false);
export const todoCreateValidationForServer = getTodoCreateValidation(true);