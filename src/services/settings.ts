import { doc, onSnapshot, setDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "../lib/firebase";
import { DEFAULT_SETTINGS, type UserSettings } from "../types";

// Documento único: users/{uid}/settings/profile
const settingsDoc = (uid: string) => doc(db, "users", uid, "settings", "profile");

export function listenSettings(uid: string, onChange: (settings: UserSettings) => void): Unsubscribe {
  return onSnapshot(settingsDoc(uid), (snap) => {
    onChange({ ...DEFAULT_SETTINGS, ...(snap.data() as Partial<UserSettings> | undefined) });
  });
}

export async function updateSettings(uid: string, patch: Partial<UserSettings>): Promise<void> {
  await setDoc(settingsDoc(uid), patch, { merge: true });
}
