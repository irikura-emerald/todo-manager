import { hash } from "crypto";

export default function encrypt(password: string) {
    return hash("sha256", password);
}
