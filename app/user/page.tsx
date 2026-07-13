"use client"

import EmailForm from "@/components/user-item-form/EmailForm";
import NameForm from "@/components/user-item-form/NameForm";
import PasswordForm from "@/components/user-item-form/PasswordForm";
import TellForm from "@/components/user-item-form/TellForm";
import { Button } from "@mui/material";
import { SessionProvider } from "next-auth/react";

export default function UserPage() {
    return (
        <>
            <SessionProvider>
                <NameForm />
                <EmailForm />
                <TellForm />
                <PasswordForm />
            </SessionProvider>
            <Button>退会</Button>
        </>
    );
}