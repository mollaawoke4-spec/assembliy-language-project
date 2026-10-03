/**
 * Resolve an image reference (from `image`, `image_url`, `imageUrl`, `photo`,
 * `photo_url`, `thumbnail`, etc. fields) that points at a static file dropped
 * into `frontend/public/upload/` (served at `/upload/<file>`).
 *
 * This mirrors the pattern already used for room/desk/food photos in
 * `backend/utils/mediaUrl.js`, but for general-purpose site assets (logo,
 * gallery images, etc.) that live in the frontend's own upload folder
 * instead of the backend's `uploads/` directory.
 *
 * Accepts:
 *  - a bare filename:      "logo.png"          -> "/upload/logo.png"
 *  - a relative path:      "upload/logo.png"   -> "/upload/logo.png"
 *  - an absolute path:     "/upload/logo.png"  -> "/upload/logo.png"
 *  - a full external URL:  "https://..."       -> returned unchanged
 * Falls back to `fallback` (default: null) for empty/invalid values so
 * callers can skip rendering an <img> entirely rather than show a broken icon.
 */
export function resolveUploadPath(src, fallback = null) {
    if (!src) return fallback;
    let p = String(src).trim().replace(/\\/g, '/');
    if (!p || p === 'undefined' || p === 'null') return fallback;

    // Full external URL or data URI — use as-is, never prefix it.
    if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) {
        return p;
    }

    if (p.startsWith('/upload/')) return p;
    if (p.startsWith('upload/')) return '/' + p;

    // Bare filename — resolve against the frontend's static upload folder.
    const file = p.replace(/^.*\//, '');
    return `/upload/${file}`;
}

export default resolveUploadPath;
