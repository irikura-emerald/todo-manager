"use client"

import BaseForm, { BaseFormProps } from "@/components/user-item-form/BaseForm";
import PasswordForm from "@/components/user-item-form/PasswordForm";
import { deleteAuthenticatedUser, updateEmail, updateName, updateTell } from "@/lib/user-control";
import { emailValidation, nameValidation, tellValidation } from "@/validation/update-user-validation";
import { Button } from "@mui/material";
import { SessionProvider, signOut } from "next-auth/react";

export default function UserPage() {
    const nameFormProps: BaseFormProps = {
        label: "Name",
        type: "text",
        column: "name",
        autoComplete: "name",
        validation: nameValidation,
        updateColumn: updateName,
    };

    const emailFormProps: BaseFormProps = {
        label: "Email",
        type: "email",
        column: "email",
        autoComplete: "email",
        validation: emailValidation,
        updateColumn: updateEmail,
        processPreupdate: () => {
            const isUpdatable = confirm(`Emailを変更する場合、セッション情報を更新するためログアウトします。\n変更しますか？`);
            return isUpdatable;
        },
        processPostupdate: (isSuccessful) => {
            if (isSuccessful) {
                signOut();
            }
        }
    };

    const tellFormProps: BaseFormProps = {
        label: "Tell",
        type: "tel",
        column: "tell",
        autoComplete: "tel",
        validation: tellValidation,
        updateColumn: updateTell,
    };

    const deleteUser = () => {
        const isDeletable = confirm("本当に退会しますか？\n名前・Email・Tell・Todoなどすべて削除され、復元できなくなります。");
        if (!isDeletable) {
            return;
        }
        deleteAuthenticatedUser()
            .then(() => {
                signOut();
            });
    };

    return (
        <>
            <SessionProvider>
                <BaseForm {...nameFormProps} />
                <BaseForm {...emailFormProps} />
                <BaseForm {...tellFormProps} />
                <PasswordForm />
            </SessionProvider>
            <Button onClick={deleteUser}>退会</Button>
        </>
    );
}