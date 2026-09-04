//Job of this module,

/* '
should model the locked and unlocked states of the password manager

Locked: no decrypted vault available

Unlock:
- Accept master pass + stored encrypted-vault string
-deserialize encrypted vault and then decrypt
-retain decrypted vault in memory to use

Unlocked:
-get entries for site needing password inputted
-add an entry
-update an entry for password change
-remove entry if user wants to (manual)

Lock:
-encrypt the vault thats in memory
-serialize the vault and store it
-clear the vault in memory
*/
import {Vault} from '../vaultManagement/vaultDataStructure'
import {deserializeEncryptedVault} from '../vaultManagement/encryptedVaultStorage'
import {decryptVault} from '../crypto/crypto'
class vaultSession {
    private vault : Vault | null = null;
    private isLocked : boolean = true;


    public async unlock(masterPass: string, storedVaultData: string) {
        const encryptedVault = deserializeEncryptedVault(storedVaultData);
        try{
            this.vault = await decryptVault(masterPass, encryptedVault)

        } catch(e){
            console.error("An error has occured:", e)
        }
    }

    
}