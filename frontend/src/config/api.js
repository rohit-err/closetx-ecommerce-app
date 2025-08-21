const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const AUTH_API_URL = `${API_BASE_URL}/api/user`
export const PRODUCT_API_URL = `${API_BASE_URL}/api/product`
export const PAYMENT_API_URL = `${API_BASE_URL}/api/payment`