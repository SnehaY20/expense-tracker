const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export const apiCall = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Get auth token
  const token = localStorage.getItem('token');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    
    if (response.status === 401) {
      const isPasswordUpdate = 
        typeof endpoint === "string" &&
        endpoint.includes("/auth/") &&
        options.method === "PUT" &&
        !endpoint.includes("/login") &&
        !endpoint.includes("/register");
      
      if (!isPasswordUpdate) {
        localStorage.removeItem('token');
        
        window.location.href = '/login';
        return;
      }
    }
    
    if (response.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    }
    
    if (response.status >= 500) {
      console.error('Server error:', response.status, response.statusText);
    }
    
    return response;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.error('Network error - check your connection or CORS configuration');
    }
    throw error;
  }
};
