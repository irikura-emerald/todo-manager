import { Button, Link } from "@mui/material";
import { signOut } from "next-auth/react";

export default function Navigation() {
    return (
        <header>
            <Link href="/">TODOリスト</Link>
            <Link href="/user">利用者情報</Link>
            <Button onClick={() => signOut()}>ログアウト</Button>
        </header>
    );
}