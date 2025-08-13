# Farcaster Delegated Signer Workflows

This document outlines how delegated signers are issued, stored, rotated, and recovered in Farcaster-enabled applications. It also highlights backend security considerations to protect custody and signer keys.

## Issuance
1. **Generate key pair:** The backend creates a new Ed25519 key pair. Private keys should be generated inside a secure environment such as an HSM or isolated container.
2. **Link to custody address:** Use the custody wallet to sign a `signerAdd` message that delegates signing rights to the new public key.
3. **Broadcast to Hub:** Submit the `signerAdd` message to a Farcaster Hub so the network recognizes the delegated signer.
4. **Persist metadata:** Record signer identifier, creation time, and associated custody address in persistent storage for audit and future rotation tasks.

## Storage
- **Secret storage:** Private keys must be encrypted at rest using a strong KMS or HSM. Access should be restricted to the signing service.
- **Metadata database:** Store signer metadata (public key, status, issued timestamp) in a durable database. Avoid storing private keys alongside metadata unless necessary.
- **Monitoring:** Implement logging and monitoring to detect unauthorized access or unusual signing patterns.

## Rotation
1. **Pre-issue replacement:** Generate a new signer and broadcast its `signerAdd` message before revoking the old one to avoid downtime.
2. **Update application references:** Update backend services to use the new signer once the network accepts it.
3. **Revoke old signer:** Use the custody key to sign and broadcast a `signerRemove` message for the old signer.
4. **Archive or destroy:** Securely delete the old private key or move it to cold storage if required for audit trails.

## Recovery
- **Lost key:** If a signer key is lost, generate a new signer and broadcast `signerAdd`. If the lost key might be exposed, immediately broadcast `signerRemove` for the compromised signer.
- **Custody compromise:** Rotate the custody key itself, re-issuing delegated signers under the new custody address and updating application references.
- **Backups:** Maintain encrypted backups of custody keys and critical signer metadata in geographically separate locations to facilitate disaster recovery.

## Security Considerations
- **Principle of least privilege:** Grant services only the minimum permissions required to perform signing operations.
- **Isolation:** Run signing services in isolated networks or containers, limiting egress to Farcaster Hubs.
- **Rate limiting & alerts:** Rate-limit signing requests and alert on unusual volumes or patterns.
- **Regular audits:** Periodically audit key issuance logs, access control lists, and signer activity to detect misuse.
- **Incident response:** Establish clear procedures for key compromise, including immediate revocation, forensic analysis, and communication to affected users.

