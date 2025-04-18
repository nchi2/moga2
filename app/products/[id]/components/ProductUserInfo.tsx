import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { formatUsername } from "@/lib/utils";

interface ProductUserInfoProps {
    username: string;
    avatar: string | null;
}

export default function ProductUserInfo({ username, avatar }: ProductUserInfoProps) {
    return (
        <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
            <div className="relative size-10 overflow-hidden rounded-full">
                {avatar !== null ? (
                    <Image
                        className="object-cover"
                        fill
                        src={avatar}
                        alt={username}
                    />
                ) : (
                    <UserIcon />
                )}
            </div>
            <div>
                <h3>{formatUsername(username)}</h3>
            </div>
        </div>
    );
} 