import { Button, Link } from "@mui/material";

export default function Navigation() {
    return (
        <header>
            <Link href="/">TODOリスト</Link>
            <Link href="/user">利用者情報</Link>
            <Button>ログアウト</Button>
        </header>
    );
}