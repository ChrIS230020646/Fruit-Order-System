function getApiBaseUrl() {

  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  const currentHostname = window.location.hostname;
  if (currentHostname === "localhost" || currentHostname === "127.0.0.1") {
    return "http://localhost:3020";
  }

  return "";
}

const api = getApiBaseUrl();
console.log("API address:", api);


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
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            let errorData = null;

            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } else {
                    const errorText = await response.text();
                    console.error(`HTTP not: ${response.status}`, errorText);
                }
            } catch (parseError) {
                console.error('Failed to parse error response:', parseError);
            }

            return {
                success: false,
                error: errorMessage,
                status: response.status,
                data: errorData
            };
        }
        
        const data = await response.json();
        console.log(` API succesful:`, data);
        return data;
        
    } catch (error) {
        console.error(` API file [${endpoint}]:`, error.message);

        let userFriendlyError = 'Network request failed';
        if (error.message.includes('Failed to fetch')) {
            userFriendlyError = `Unable to connect to the server (${api || 'unknown'})`;
        } else if (error.message.includes('Network Error')) {
            userFriendlyError = 'A network connection error has occurred. Please check your network connection.';
        } else {
            userFriendlyError = error.message;
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
