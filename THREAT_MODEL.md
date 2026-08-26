# Password Manager Threat Model

## Assets

- Master password
- Encrypted vault data
- Decrypted credentials held in memory after unlock
- Credentials inserted into webpage fields
- Generated passwords before and after they are saved

## Attackers

- A malicious webpage
- A fake or phishing domain
- A malicious iframe
- Someone who copies the encrypted vault file
- Someone with access to the computer while the vault is unlocked

## Assumptions

- The browser and operating system are trusted.
- The first version stores the vault locally and has no cloud synchronization.
- The master password is never stored in the vault.
- The extension never autofills automatically; the user must click a Fill action.

## Security Decisions

- While locked, vault data on disk is encrypted and cannot be read without the master password.
- After unlock, decrypted credentials may remain in memory until the idle timeout locks the vault again.
- The initial idle timeout will be configurable; the first implementation should use a short default such as five minutes.
- Subdomains of the same registrable domain count as one site. For example, `accounts.example.com` and `shop.example.com` may match `example.com`.
- Site matching must use a Public Suffix List-aware registrable-domain parser. It must not use an unsafe string suffix check, since `example.com.attacker.com` must never match `example.com`.
- Autofill must require an explicit user action and must only be offered on HTTPS pages.

## Threats, Impact, and Mitigations

| Threat | Impact | Mitigation |
| --- | --- | --- |
| A malicious webpage reads an injected password | The credential is exposed to the page | Require a user click, fill only recognized fields, and minimize how long plaintext remains in the page |
| A phishing domain requests autofill | Credentials are sent to an attacker | Match using a Public Suffix List-aware registrable domain and show the matched site before filling |
| An attacker copies the vault file | Stored credentials may be attacked offline | Use a password-based key derivation function and authenticated encryption |
| Someone uses the computer while unlocked | Decrypted credentials may be exposed | Lock after an idle timeout and do not claim to protect a compromised unlocked computer |
| A malicious iframe contains a login form | Credentials may be filled into an unexpected origin | Treat the iframe origin separately and require explicit confirmation |

## Out of Scope for Version One

- Cloud synchronization
- Sharing credentials between users
- Protection from a compromised operating system or browser
- Protection from malicious browser extensions with broad permissions