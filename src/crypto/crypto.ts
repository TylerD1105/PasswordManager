

export async function deriveEncryptionKey(password: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
    // Derive a key from the password using PBKDF2
    return crypto.subtle.deriveKey(
        {
            name : "PBKDF2",
            hash : "SHA-256",
            salt,
            iterations : 600000
        },
        await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(password),
            "PBKDF2",
            false,
            ["deriveKey"]
        ),
        {
            name : "AES-GCM",
            length : 256
        },
        false, 
        ["encrypt", "decrypt"]
    )

}