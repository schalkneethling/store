type JSONPrimitive = string | number | boolean | null;

interface JSONObject {
  [key: string]: JSONValue;
}

type JSONArray = JSONValue[];

type JSONValue = JSONPrimitive | JSONObject | JSONArray;

/**
 * Interface for storage operation results
 */
interface StorageResult<T extends JSONValue> {
  success: boolean;
  data?: T;
  error?: string;
}

const storageActions = {
  getEntryFromStorage: <T extends JSONValue>(key: string): StorageResult<T> => {
    try {
      const result = localStorage.getItem(key);

      if (!result) {
        return {
          success: false,
          error: `${key} not found in storage.`,
        };
      }

      return {
        success: true,
        data: JSON.parse(result) as T,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get entry from storage: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },

  setItemInStorage: <T extends JSONObject>(
    key: string,
    value: T,
    preserveExisting = false,
  ): StorageResult<T> => {
    try {
      if (!preserveExisting) {
        localStorage.setItem(key, JSON.stringify(value));
        return { success: true, data: value };
      }

      const { success, data, error } =
        storageActions.getEntryFromStorage<T>(key);

      if (!success && error?.includes("not found")) {
        localStorage.setItem(key, JSON.stringify(value));
        return { success: true, data: value };
      }

      if (!success) {
        return { success: false, error };
      }

      const updatedValue = {
        ...data,
        ...Object.fromEntries(
          Object.entries(value).filter(
            ([key]) => !Object.prototype.hasOwnProperty.call(data, key),
          ),
        ),
      } as T;

      localStorage.setItem(key, JSON.stringify(updatedValue));
      return { success: true, data: updatedValue };
    } catch (error) {
      return {
        success: false,
        error: `Failed to set item in storage: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },

  hasPropertyForKey: (
    key: string,
    property: keyof JSONObject,
  ): StorageResult<boolean> => {
    try {
      const { success, data, error } =
        storageActions.getEntryFromStorage<JSONObject>(key);

      if (!success) {
        return { success: false, error };
      }

      return {
        success: true,
        data: data && property in data,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to check property: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },

  updateStoredPropsForKey: <T extends JSONObject>(
    key: string,
    propertyUpdates: Partial<T>,
  ): StorageResult<T> => {
    try {
      const { success, data, error } =
        storageActions.getEntryFromStorage<T>(key);

      if (!success) {
        return { success: false, error };
      }

      const updatedValue = {
        ...data,
        ...Object.fromEntries(
          Object.entries(propertyUpdates).filter(([key]) =>
            Object.prototype.hasOwnProperty.call(data, key),
          ),
        ),
      } as T;

      localStorage.setItem(key, JSON.stringify(updatedValue));
      return { success: true, data: updatedValue };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update properties: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
};

export default storageActions;
