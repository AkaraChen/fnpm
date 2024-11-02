const encoder = new TextEncoder();

export async function sha256(input: string) {
    const buf = await crypto.subtle.digest('SHA-256', encoder.encode(input));
    return Array.from(new Uint8Array(buf))
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('');
}
