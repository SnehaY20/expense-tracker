import { getAuthHeaders } from './AuthHeaders';

class ApiClient {
  constructor() {
    this.onUnauthorized = null;
  }

  setUnauthorizedHandler(handler) {
    this.onUnauthorized = handler;
  }

  async request(url, options = {}) {
    const config = {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        if (this.onUnauthorized) {
          this.onUnauthorized();
          return Promise.resolve({ redirected: true });
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error.message?.includes('Failed to fetch') && this.onUnauthorized) {
        this.onUnauthorized();
        return Promise.resolve({ redirected: true });
      }
      throw error;
    }
  }

  get(url, options) {
    return this.request(url, { ...options, method: 'GET' });
  }

  post(url, data, options) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(url, data, options) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(url, options) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(); 