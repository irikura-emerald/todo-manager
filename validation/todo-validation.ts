import { testTodoOwner } from "@/lib/todo-control";
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

export const todoMoveValidation = yup.object({
    from: yup
        .number()
        .label("移動元")
        .required()
        .test({
            name: "todolist-owner-test",
            message: ({ label }: { label: string }) => `この${label}は存在しません。`,
            test: testTodoOwner,
        }),
    to: yup
        .number()
        .label("移動先")
        .required()
        .test({
            name: "todolist-owner-test",
            message: ({ label }: { label: string }) => `この${label}は存在しません。`,
            test: testTodoOwner,
        })
        .notOneOf([yup.ref("from")]),
});