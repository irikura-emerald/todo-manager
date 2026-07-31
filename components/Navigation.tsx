import { Button, Link } from "@mui/material";
import { signOut } from "next-auth/react";

export default function Navigation() {
    return (
        <header className="flex justify-between bg-blue-100">
            <div className="flex items-center">
                <div className="mx-3">
                    <Link href="/" underline="hover">TODOリスト</Link>
                </div>
                <div className="mx-3">
                    <Link href="/user" underline="hover">利用者情報</Link>
                </div>
            </div>
            <Button onClick={() => signOut()} variant="text">ログアウト</Button>
        </header>
    );
}