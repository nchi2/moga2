"use client";

import { useEffect } from "react";
import { incrementViews } from "./actions";

export default function ViewCounter({ postId }: { postId: number }) {
    useEffect(() => {
        incrementViews(postId);
    }, [postId]);

    return null;
} 