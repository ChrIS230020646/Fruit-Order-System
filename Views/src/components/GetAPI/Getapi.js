


function getApiBaseUrl() {
    const currentHostname = window.location.hostname;
    const currentProtocol = window.location.protocol;

    console.log('Current access address:', window.location.href);
    console.log('real time Hostname:', currentHostname);
    console.log('real time Protocol:', currentProtocol);
    

    if (currentHostname === 'localhost' || currentHostname === '127.0.0.1') {
        return 'http://localhost:3020';
    }

    return `${currentProtocol}//${currentHostname}:3020`;
}

const api = getApiBaseUrl();

console.log(' API address:', api);


async function checkBackendConnection() {
    try {
        const response = await fetch(`${api}/server/info`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('check:', response.ok ? 'succesful' : 'false');
        return response.ok;
    } catch (error) {
        console.error('false:', error.message);
        return false;
    }
}


async function callAPI(endpoint, options = {}) {
    const url = `${api}${endpoint}`;
    
    console.log(`API: ${url}`, options);

    try {
        const defaultOptions = {
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options
        };

        const response = await fetch(url, defaultOptions);
        
        console.log(`API: ${response.status} ${response.statusText}`);
        
        
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
            console.log(' Cookie:', setCookieHeader);
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP not: ${response.status}`, errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(` API succesful:`, data);
        return data;
        
    } catch (error) {
        console.error(` API file [${endpoint}]:`, error.message);
        
        
        let userFriendlyError = 'web false';
        if (error.message.includes('Failed to fetch')) {
            userFriendlyError = ` (${api})`;
        } else if (error.message.includes('Network Error')) {
            userFriendlyError = 'not find Network';
        } else if (error.message.includes('HTTP')) {
            userFriendlyError = `not: ${error.message}`;
        }
        
        return {
            success: false,
            error: userFriendlyError,
            originalError: error.message
        };
    }
}


async function getAPI(endpoint) {
    return callAPI(endpoint, {
        method: 'GET'
    });
}


async function postAPI(endpoint, data) {
    return callAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}


async function putAPI(endpoint, data) {
    return callAPI(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}


async function deleteAPI(endpoint) {
    return callAPI(endpoint, {
        method: 'DELETE'
    });
}

const GetApi = {
    api,
    getAPI,
    postAPI,
    putAPI,
    deleteAPI,
    callAPI,
    checkBackendConnection
};

export default GetApi;