export function formatToTimeAgo(date: string): string {
    const now = new Date().getTime();
    const time = new Date(date).getTime();
    const diff = now - time;

    const dayInMs = 1000 * 60 * 60 * 24;
    const hourInMs = 1000 * 60 * 60;
    const minuteInMs = 1000 * 60;

    const days = Math.floor(diff / dayInMs);
    const hours = Math.floor((diff % dayInMs) / hourInMs);
    const minutes = Math.floor((diff % hourInMs) / minuteInMs);

    if (days > 0) {
        return `${days}일 ${hours}시간 전`;
    } else if (hours > 0) {
        return `${hours}시간 ${minutes}분 전`;
    } else if (minutes > 0) {
        return `${minutes}분 전`;
    } else {
        return '방금 전';
    }
}

export function formatToWon(price: number): string {
    return price.toLocaleString("ko-KR");
}

export function formatUsername(username: string): string {
    return username.replace('github_', '');
}