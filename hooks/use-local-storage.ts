import { useCallback, useEffect, useState } from "react";
import { useWindowEvent } from "./use-window-event";

export type StorageType = "localStorage" | "sessionStorage";

export interface StorageProperties<T> {
  key: string;
  defaultValue?: T;
  getInitialValueInEffect?: boolean;
  sync?: boolean;
  serialize?: (value: T) => string;
  deserialize?: (value: string | undefined) => T;
}

function serializeJSON<T>(value: T, hookName = "use-local-storage") {
  try {
    return JSON.stringify(value);
  } catch (_error) {
    throw new Error(`${hookName}: Failed to serialize the value`);
  }
}

function deserializeJSON(value: string | undefined) {
  try {
    return value && JSON.parse(value);
  } catch {
    return value;
  }
}

function createStorageHandler(type: StorageType) {
  const getItem = (key: string) => {
    try {
      return window[type].getItem(key);
    } catch (_error) {
      console.warn(
        "use-local-storage: Failed to get value from storage, localStorage is blocked",
      );
      return null;
    }
  };

  const setItem = (key: string, value: string) => {
    try {
      window[type].setItem(key, value);
    } catch (_error) {
      console.warn(
        "use-local-storage: Failed to set value to storage, localStorage is blocked",
      );
    }
  };

  const removeItem = (key: string) => {
    try {
      window[type].removeItem(key);
    } catch (_error) {
      console.warn(
        "use-local-storage: Failed to remove value from storage, localStorage is blocked",
      );
    }
  };

  return { getItem, setItem, removeItem };
}

export function createStorage<T>(type: StorageType, hookName: string) {
  const eventName =
    type === "localStorage" ? "hook-local-storage" : "hook-session-storage";
  const { getItem, setItem, removeItem } = createStorageHandler(type);

  return function useStorage({
    key,
    defaultValue,
    getInitialValueInEffect = true,
    sync = true,
    deserialize = deserializeJSON,
    serialize = (value: T) => serializeJSON(value, hookName),
  }: StorageProperties<T>) {
    const readStorageValue = useCallback(
      (skipStorage?: boolean): T => {
        let storageBlockedOrSkipped;

        try {
          storageBlockedOrSkipped =
            typeof window === "undefined" ||
            !(type in window) ||
            window[type] === null ||
            !!skipStorage;
        } catch (_e) {
          storageBlockedOrSkipped = true;
        }

        if (storageBlockedOrSkipped) {
          return defaultValue as T;
        }

        const storageValue = getItem(key);
        return storageValue !== null
          ? deserialize(storageValue)
          : (defaultValue as T);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [key, defaultValue],
    );

    const [value, setValue] = useState<T>(
      readStorageValue(getInitialValueInEffect),
    );

    const setStorageValue = useCallback(
      (val: T | ((prevState: T) => T)) => {
        if (val instanceof Function) {
          setValue((current) => {
            const result = val(current);
            setItem(key, serialize(result));
            window.dispatchEvent(
              new CustomEvent(eventName, {
                detail: { key, value: val(current) },
              }),
            );
            return result;
          });
        } else {
          setItem(key, serialize(val));
          window.dispatchEvent(
            new CustomEvent(eventName, { detail: { key, value: val } }),
          );
          setValue(val);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [key],
    );

    const removeStorageValue = useCallback(() => {
      removeItem(key);
      window.dispatchEvent(
        new CustomEvent(eventName, { detail: { key, value: defaultValue } }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useWindowEvent("storage", (event) => {
      if (sync) {
        if (event.storageArea === window[type] && event.key === key) {
          setValue(deserialize(event.newValue ?? undefined));
        }
      }
    });

    useWindowEvent(eventName, (event) => {
      if (sync) {
        if (event.detail.key === key) {
          setValue(event.detail.value);
        }
      }
    });

    useEffect(() => {
      if (defaultValue !== undefined && value === undefined) {
        setStorageValue(defaultValue);
      }
    }, [defaultValue, value, setStorageValue]);

    useEffect(() => {
      const val = readStorageValue();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      val !== undefined && setStorageValue(val);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return [
      value === undefined ? defaultValue : value,
      setStorageValue,
      removeStorageValue,
    ] as [T, (val: T | ((prevState: T) => T)) => void, () => void];
  };
}

export function readValue(type: StorageType) {
  const { getItem } = createStorageHandler(type);

  return function read<T>({
    key,
    defaultValue,
    deserialize = deserializeJSON,
  }: StorageProperties<T>) {
    let storageBlockedOrSkipped;

    try {
      storageBlockedOrSkipped =
        typeof window === "undefined" ||
        !(type in window) ||
        window[type] === null;
    } catch (_e) {
      storageBlockedOrSkipped = true;
    }

    if (storageBlockedOrSkipped) {
      return defaultValue as T;
    }

    const storageValue = getItem(key);
    return storageValue !== null
      ? deserialize(storageValue)
      : (defaultValue as T);
  };
}

export function useLocalStorage<T = string>(props: StorageProperties<T>) {
  return createStorage<T>("localStorage", "use-local-storage")(props);
}

export const readLocalStorageValue = readValue("localStorage");
