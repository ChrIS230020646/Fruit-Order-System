import GetApi from './GetAPI/Getapi.js';

function LoginPage() {
    const handleLogin = async () => {
        
        const rootData = await GetApi.getAPI();
        console.log('root path data:', rootData);
        
        
        const staffData = await fetch(`${GetApi.api}/staff`);
        console.log('employee data:', staffData.json());
        
        console.log('API address:', GetApi.api);
    };

    return (
        <div>
            <button onClick={handleLogin}>Log in</button>
        </div>
    );
}

export default LoginPage;