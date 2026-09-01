//This file is used for converting encrypted vaults to a data format that can be used to store it in the browsers local storage as well as locally on a computer.
import {EncryptedVault} from "../crypto/crypto";

export function serializeEncryptedVault(encryptedVault: EncryptedVault): string {
    const serialized = {
        salt: new TextDecoder().decode(encryptedVault.salt),
        nonce: new TextDecoder().decode(encryptedVault.nonce),
        ciphertext: new TextDecoder().decode(encryptedVault.ciphertext)
    };
    return JSON.stringify(serialized);
}

export function deserializeEncryptedVault(data: string): EncryptedVault {
    const parsed = JSON.parse(data);
    return {
        salt: new TextEncoder().encode(parsed.salt),
        nonce: new TextEncoder().encode(parsed.nonce),
        ciphertext: new TextEncoder().encode(parsed.ciphertext)
    };
}

