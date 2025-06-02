export const formatDate = (iso: string): string => {
    const date = new Date(iso);
    const today = new Date();

    const diffDays = Math.floor(
        (today.getTime() - date.getTime()) / 86_400_000
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
};

export const truncateTitle = (title: string | null, len = 35) =>
    (title || 'Untitled').length <= len
        ? title || 'Untitled'
        : `${title?.slice(0, len)}…`;