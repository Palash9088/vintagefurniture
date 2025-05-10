const axios = require('axios'); // Import axios for making HTTP requests

// Define your function
async function sendVwoIntegrationEvent(payload, settings) {
    const epochTime = new Date().valueOf();
    const time = Math.floor(epochTime);
    let action;

    if (payload.name === 'Audience Entered') {
        action = 'audience_entered';
    } else if (payload.name === 'Audience Exited') {
        action = 'audience_exited';
    }

    const vwoPayload = {
        d: {
            event: {
                name: 'vwo_integration',
                time,
                props: {
                    'integration': 'segment',
                    'audienceName': 'segment_predictive_membership_purchase',
                    'accountId': 8000846,
                    'audienceId': 'segment_predictive_membership_purchase',
                    'identifier': 'c31650b2-275c-4d2b-af12-1aa3d86c0429',
                    'action': 'audience_entered'
                }
            }
        }
    };

    const endpoint = `https://dev.visualwebsiteoptimizer.com/events/t?en=vwo_integration&a=8000846`;

    try {
        // Make the HTTP POST request using axios
        const response = await axios.post(endpoint, vwoPayload);
        return response.data; // Return the response data if needed
    } catch (error) {
        console.error('Error sending VWO integration event:', error);
        throw error; // Throw the error for handling it further up the call stack
    }
}

// Example usage of the function
const payload = {
    name: 'Audience Entered', // Example payload data
    audienceId: 'exampleAudienceId',
    userId: 'exampleUserId'
};

const settings = {
    vwoAccountId: '8000846'
};

// Call the function and handle the promise
sendVwoIntegrationEvent(payload, settings)
    .then((result) => {
        console.log('VWO integration event sent successfully:', result);
    })
    .catch((error) => {
        console.error('Failed to send VWO integration event:', error);
    });