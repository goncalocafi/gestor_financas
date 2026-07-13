import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { listenSettings, updateSettings } from "../services/settings";
import { DEFAULT_SETTINGS, type UserSettings } from "../types";

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    return listenSettings(user.uid, (s) => {
      setSettings(s);
      setLoading(false);
    });
  }, [user]);

  const save = (patch: Partial<UserSettings>) => {
    if (!user) return Promise.resolve();
    return updateSettings(user.uid, patch);
  };

  return { loading, settings, save };
}
