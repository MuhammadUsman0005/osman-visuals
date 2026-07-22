const STORAGE_KEY = "ov_instagram_followed";
const EVENT_NAME = "ov_instagram_followed_changed";

const EMAIL_KEY = "ov_email_captured";
const EMAIL_EVENT = "ov_email_captured_changed";

export function readFollowed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function persistFollowed() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    /* storage full / disabled — ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function persistUnlock() {
  persistFollowed();
}

export function onFollowedChange(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const onEvent = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };

  window.addEventListener(EVENT_NAME, onEvent);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(EVENT_NAME, onEvent);
    window.removeEventListener("storage", onStorage);
  };
}

export function readEmailCaptured(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(EMAIL_KEY) === "true";
  } catch {
    return false;
  }
}

export function persistEmailCaptured() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EMAIL_KEY, "true");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EMAIL_EVENT));
}

export function onEmailCapturedChange(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const onEvent = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === EMAIL_KEY) callback();
  };
  window.addEventListener(EMAIL_EVENT, onEvent);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EMAIL_EVENT, onEvent);
    window.removeEventListener("storage", onStorage);
  };
}
