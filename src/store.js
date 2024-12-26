/**
 * Retrieves an entry from local storage by the given key.
 * @param {string} key - The key of the entry to retrieve from local storage.
 * @returns {object|null} The parsed JSON object from local storage, or null if an error occurs.
 * @throws {Error} If the key is not found in local storage.
 */
const getEntryFromStorage = (key) => {
	let result = null;
	try {
		result = localStorage.getItem(key);

		if (!result) {
			throw new Error(`${key} not found in local storage.`);
		}
	} catch (error) {
		// @TODO: we need something better than logging errors to the console.
		console.error(error);
	}

	return result ? JSON.parse(result) : null;
};

/**
 * Stores an item in localStorage.
 * @param {string} key - The key under which the value should be stored.
 * @param {object} value - The value to be stored.
 * @param {boolean} [preserveExisting] - If true, preserves any existing properties in storage and only adds new ones.
 * If false, completely replaces any existing data for the key with the new value (default: false)
 * @returns {boolean} - Returns true if the item was added successfully, false otherwise.
 */
const setItemInStorage = (key, value, preserveExisting = false) => {
	let itemAdded = false;

	try {
		if (!preserveExisting) {
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			const entry = getEntryFromStorage(key);
			Object.keys(value).forEach((key) => {
				if (!entry[key]) {
					entry[key] = value[key];
				}
			});
			localStorage.setItem(key, JSON.stringify(entry));
		}
		itemAdded = true;
	} catch (error) {
		// @TODO: we need something better than logging errors to the console.
		console.error(error);
	}

	return itemAdded;
};

/**
 * Checks if a specific property exists in the stored object for a given key.
 * @param {string} key - The key in localStorage to check
 * @param {string} property - The property name to look for in the stored object
 * @returns {boolean} - Returns true if the property exists, false otherwise
 * @example
 * // Checks if 'name' property exists in the 'user' storage entry
 * hasPropertyForKey('user', 'name')
 */
const hasPropertyForKey = (key, property) => {
	let hasProperty = false;

	try {
		const entry = getEntryFromStorage(key);
		hasProperty = entry && entry[property] !== undefined;
	} catch (error) {
		// @TODO: we need something better than logging errors to the console.
		console.error(error);
	}

	return hasProperty;
};

/**
 * Updates existing properties in localStorage for a given key. Only updates properties that already exist.
 * @param {string} key - The key in localStorage to update
 * @param {{[key: string]: any}} propertyUpdates - Object containing key-value pairs of properties to update
 * @returns {boolean} - Returns true if the update was successful, false otherwise
 * @example
 * // Updates the name and age if they already exist in storage
 * updateStoredPropsForKey('user', { name: 'John', age: 30 })
 */
const updateStoredPropsForKey = (key, propertyUpdates) => {
	let updated = false;

	try {
		const entry = getEntryFromStorage(key);
		Object.keys(propertyUpdates).forEach((property) => {
			if (entry[property]) {
				entry[property] = propertyUpdates[property];
			}
		});
		localStorage.setItem(key, JSON.stringify(entry));
		updated = true;
	} catch (error) {
		// @TODO: we need something better than logging errors to the console.
		console.error(error);
	}

	return updated;
};

export {
	getEntryFromStorage,
	hasPropertyForKey,
	setItemInStorage,
	updateStoredPropsForKey,
};
