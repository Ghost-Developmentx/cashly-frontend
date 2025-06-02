import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function renderSafeMarkdown(markdown: string): string {
    const rawHtml = marked(markdown) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
    });
    return cleanHtml;
}
