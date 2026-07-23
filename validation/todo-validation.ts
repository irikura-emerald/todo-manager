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

function getTodoIdRule(isForServer: boolean) {
    return yup
        .number()
        .label("TODO ID")
        .required()
        .test({
            name: "todolist-owner-test",
            message: ({ label }: { label: string }) => `この${label}は存在しません。`,
            test: isForServer ? testTodoOwner : () => true,
        });
}

function getTodoUpdateNameValidation(isForServer: boolean) {
    return yup.object({
        id: getTodoIdRule(isForServer),
        value: yup
            .string()
            .label("TODO名")
            .required()
            .max(100),
    });
}
export const todoUpdateNameValidationForClient = getTodoUpdateNameValidation(false);
export const todoUpdateNameValidationForServer = getTodoUpdateNameValidation(true);

function getTodoUpdateDeailValidation(isForServer: boolean) {
    return yup.object({
        id: getTodoIdRule(isForServer),
        value: yup
            .string()
            .label("詳細")
            .required()
            .max(1000),
    });
}
export const todoUpdateDetailValidationForClient = getTodoUpdateDeailValidation(false);
export const todoUpdateDetailValidationForServer = getTodoUpdateDeailValidation(true)

function getTodoUpdateDeadlineValidation(isForServer: boolean) {
    return yup.object({
        id: getTodoIdRule(isForServer),
        value: yup
            .string()
            .label("期日")
            .datetime()
            .required(),
    });
}
export const todoUpdateDeadlineValidationForClient = getTodoUpdateDeadlineValidation(false);
export const todoUpdateDeadlineValidationForServer = getTodoUpdateDeadlineValidation(true)

function getTodoUpdateIsDoneValidation(isForServer: boolean) {
    return yup.object({
        id: getTodoIdRule(isForServer),
        value: yup
            .string()
            .label("完了")
            .required(),
    });
}
export const todoUpdateIsDoneValidationForClient = getTodoUpdateIsDoneValidation(false)
export const todoUpdateIsDoneValidationForServer = getTodoUpdateIsDoneValidation(true)