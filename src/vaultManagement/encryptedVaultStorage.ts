//This file is used for converting encrypted vaults to a data format that can be used to store it in the browsers local storage as well as locally on a computer.
import {EncryptedVault} from "../crypto/crypto";

export function serializeEncryptedVault(encryptedVault: EncryptedVault): string {
    const serialized = {
        salt: bytesToBase64(encryptedVault.salt),
        nonce: bytesToBase64(encryptedVault.nonce),
        ciphertext: bytesToBase64(encryptedVault.ciphertext),
        version: 1
    };
    return JSON.stringify(serialized);
}

export function deserializeEncryptedVault(data: string): EncryptedVault {
    const parsed = JSON.parse(data);
    
    if (parsed.version !== 1) {
        throw new Error(`Unsupported encrypted vault version: ${parsed.version}`);
    }
    else if (typeof parsed.salt !== "string" || typeof parsed.nonce !== "string" || typeof parsed.ciphertext !== "string") {
        throw new Error("Malformed encrypted vault data");
    }
    return {
        salt: base64ToBytes(parsed.salt),
        nonce: base64ToBytes(parsed.nonce),
        ciphertext: base64ToBytes(parsed.ciphertext),
    };
}


export function bytesToBase64(bytes: Uint8Array): string {
    const base64String = Buffer.from(bytes).toString("base64");
    return base64String;
}

export function base64ToBytes(base64String: string): Uint8Array {
    const bytes = Buffer.from(base64String, "base64");
    return new Uint8Array(bytes);
}
