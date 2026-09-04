# Project TODO

## Encrypted vault storage hardening

- Validate that parsed storage data is a non-null object and not an array before reading its fields.
- Add a test that `deserializeEncryptedVault("null")` rejects malformed storage data.
- Use boundary bytes (`[0, 127, 128, 255]`) in the Base64 round-trip test.
- Rename the malformed-storage tests so missing fields and wrong field types are clearly distinct.
