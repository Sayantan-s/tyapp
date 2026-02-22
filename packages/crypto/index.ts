import sshpk from "sshpk";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export function getLocalPublicKey(
  keyType: "ed25519" | "rsa" = "ed25519",
): string {
  const keyPath = path.join(os.homedir(), ".ssh", `id_${keyType}.pub`);
  if (!fs.existsSync(keyPath)) {
    throw new Error(`Public key not found at ${keyPath}`);
  }
  return fs.readFileSync(keyPath, "utf8");
}

export function getLocalPrivateKey(
  keyType: "ed25519" | "rsa" = "ed25519",
): string {
  const keyPath = path.join(os.homedir(), ".ssh", `id_${keyType}`);
  if (!fs.existsSync(keyPath)) {
    throw new Error(`Private key not found at ${keyPath}`);
  }
  return fs.readFileSync(keyPath, "utf8");
}

export function signString(data: string, privateKeyStr: string): string {
  const key = sshpk.parsePrivateKey(privateKeyStr);
  const hash = key.type === "ed25519" ? "sha512" : "sha256";
  const signer = key.createSign(hash);
  signer.update(data);
  const signature = signer.sign();
  return signature.toString("ssh");
}

export function verifySignature(
  data: string,
  signatureStr: string,
  publicKeyStr: string,
): boolean {
  try {
    const key = sshpk.parseKey(publicKeyStr);
    const hash = key.type === "ed25519" ? "sha512" : "sha256";
    const signature = sshpk.parseSignature(
      signatureStr,
      key.type as any,
      "ssh",
    );
    const verifier = key.createVerify(hash);
    verifier.update(data);
    return verifier.verify(signature);
  } catch (e) {
    console.error("Signature verification failed:", e);
    return false;
  }
}

export function getFingerprint(publicKeyStr: string): string {
  const key = sshpk.parseKey(publicKeyStr);
  return key.fingerprint("sha256").toString();
}
