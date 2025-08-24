const API_BASE_URL = '/api/v1';

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

  const response = await fetch(url, finalOptions);
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    throw new Error('Authentication required - please log in again');
  }
  
  if (response.status === 403) {
    throw new Error('Access forbidden - insufficient permissions');
  }
  
  return response;
};

export const fetchProfile = async () => {
  const response = await apiCall("/auth/profile", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
};
