import { Vault, deserializeVault, serializeVault} from "../vaultManagement/vaultDataStructure";

export async function deriveEncryptionKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    // Derive a key from the password using PBKDF2
    return crypto.subtle.deriveKey(
        {
            name : "PBKDF2",
            hash : "SHA-256",
            salt: salt as BufferSource,
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

interface EncryptedVault {
    salt: Uint8Array;
    nonce: Uint8Array;
    ciphertext: Uint8Array;
}

export function generateRandomSalt(length: number = 16): Uint8Array{
    const salt = new Uint8Array(length);
    crypto.getRandomValues(salt);
    return salt;
}

export async function encryptVault(password: string, vault: Vault): Promise<EncryptedVault> {
    const salt = generateRandomSalt();
    const nonce =  generateRandomSalt(12); // AES-GCM standard nonce size is 12 bytes
    const encryptionKey = await deriveEncryptionKey(password, salt);
    

    const ciphertext = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: nonce as BufferSource,
        },
        encryptionKey,
        new TextEncoder().encode(serializeVault(vault))
    )
    return {
        salt,
        nonce,
        ciphertext: new Uint8Array(ciphertext)
    }
}

export async function decryptVault(password: string, encryptedVault: EncryptedVault): Promise<Vault> {
    const decryptionKey = await deriveEncryptionKey(password, encryptedVault.salt);
    const plaintext = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: encryptedVault.nonce as BufferSource,
        },
        decryptionKey,
        encryptedVault.ciphertext as BufferSource
        
    )
    //TODO: Handle decryption errors better, Web Crypto throws more specific errors we should try to catch
    const decryptedString = new TextDecoder().decode(plaintext);
    const vault = deserializeVault(decryptedString);
    if(!vault) {
        throw new Error("Failed to decrypt vault: Invalid data format");
    }
    return vault;
    

    
}