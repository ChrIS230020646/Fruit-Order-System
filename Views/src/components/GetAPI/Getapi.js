// 正确的API地址获取方式
function getApiBaseUrl() {
    // 优先使用环境变量（云端部署时）
    if (process.env.REACT_APP_API_URL) {
        console.log('使用环境变量API地址:', process.env.REACT_APP_API_URL);
        return process.env.REACT_APP_API_URL;
    }

    // 本地开发模式
    const currentHostname = window.location.hostname;
    
    console.log('当前访问地址:', window.location.href);
    console.log('实时 Hostname:', currentHostname);
    
    // 本地开发
    if (currentHostname === 'localhost' || currentHostname === '127.0.0.1') {
        console.log('本地开发模式');
        return 'http://localhost:3020';
    }

    // 局域网访问（手机/其他设备测试）
    if (currentHostname.startsWith('192.168.') || currentHostname.startsWith('172.')) {
        console.log('局域网访问模式');
        return `http://${currentHostname}:3020`;
    }

    // 默认回退（不应该到达这里）
    console.warn('未配置API地址，使用默认localhost');
    return 'http://localhost:3020';
}

const api = getApiBaseUrl();
console.log('最终使用的API地址:', api);

// 后端连接检查
async function checkBackendConnection() {
    try {
        const response = await fetch(`${api}/api/health`, {  // 改成 /api/health
            method: 'GET',
            credentials: 'include'
        });
        console.log('后端连接检查:', response.ok ? '成功' : '失败');
        return response.ok;
    } catch (error) {
        console.error('后端连接失败:', error.message);
        return false;
    }
}

// API调用封装
async function callAPI(endpoint, options = {}) {
    const url = `${api}${endpoint}`;
    
    console.log(`调用API: ${url}`, options);

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
        
        console.log(`API响应: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP错误: ${response.status}`, errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`API调用成功:`, data);
        return data;
        
    } catch (error) {
        console.error(`API调用失败 [${endpoint}]:`, error.message);
        
        let userFriendlyError = '网络请求失败';
        if (error.message.includes('Failed to fetch')) {
            userFriendlyError = `无法连接到后端服务器 (${api})`;
        } else if (error.message.includes('Network Error')) {
            userFriendlyError = '网络连接错误';
        } else if (error.message.includes('HTTP')) {
            userFriendlyError = `服务器错误: ${error.message}`;
        }
        
        return {
            success: false,
            error: userFriendlyError,
            originalError: error.message
        };
    }
}

async function getAPI(endpoint) {
    return callAPI(endpoint, { method: 'GET' });
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
    return callAPI(endpoint, { method: 'DELETE' });
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