import Image from "next/image";
import { notFound } from "next/navigation";
import { likePost, dislikePost } from "./actions";
import { getSession } from "@/lib/session";
import { formatToTimeAgo, formatUsername } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import ViewCounter from "./view-counter";
import LikeButton from "@/components/like-button";
import CommentSection from "@/components/comment-section";
import { getCachedPost, getCachedLikeStatus } from "./queries";

export default async function PostDetail({
    params,
}: {
    params: { id: string };
}) {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (isNaN(id)) {
        return notFound();
    }
    const post = await getCachedPost(id);
    if (!post) {
        return notFound();
    }
    const session = await getSession();
    const { isLiked, likeCount } = await getCachedLikeStatus(id, session.user?.id);

    return (
        <div className="p-5 text-white">
            <ViewCounter postId={id} />
            <div className="flex items-center gap-2 mb-2">
                <Image
                    width={28}
                    height={28}
                    className="size-7 rounded-full"
                    src={post.user.avatar!}
                    alt={post.user.username}
                />
                <div>
                    <span className="text-sm font-semibold">{formatUsername(post.user.username)}</span>
                    <div className="text-xs">
                        <span>{formatToTimeAgo(post.createdAt.toString())}</span>
                    </div>
                </div>
            </div>
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mb-5">{post.description}</p>
            <div className="flex flex-col gap-5 items-start">
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <EyeIcon className="size-5" />
                    <span>조회 {post.views}</span>
                </div>
                <form action={isLiked ? dislikePost : likePost}>
                    <input type="hidden" name="postId" value={id} />
                    <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
                </form>
            </div>
            <CommentSection postId={id} isLoggedIn={!!session.user} />
        </div>
    );
}