/**
 * Fetches random user data from the Random User API
 * @returns {Promise<Object>} The random user data
 */
async function getRandomUser() {
    try {
        const response = await fetch('https://randomuser.me/api', {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching random user:', error);
        throw error;
    }
}

/**
 * Gets a formatted full name from the random user data
 * @param {Object} userData - The random user data object
 * @returns {string} The formatted full name
 */
function getFullName(userData) {
    const { title, first, last } = userData.results[0].name;
    return `${title} ${first} ${last}`;
}

/**
 * Gets the user's location information
 * @param {Object} userData - The random user data object
 * @returns {Object} The location information
 */
function getLocation(userData) {
    return userData.results[0].location;
}

/**
 * Gets the user's contact information
 * @param {Object} userData - The random user data object
 * @returns {Object} The contact information
 */
function getContactInfo(userData) {
    const user = userData.results[0];
    return {
        email: user.email,
        phone: user.phone,
        cell: user.cell
    };
}

// Export the functions
export {
    getRandomUser,
    getFullName,
    getLocation,
    getContactInfo
};
