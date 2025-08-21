
import { create } from "zustand"
import axios from "axios"


const ADMIN_API_URL = `https://closetx-backend.onrender.com/api/admin`
const PRODUCT_API_URL = `https://closetx-backend.onrender.com/api/product`

axios.defaults.withCredentials = true

const useAdminStore = create((set) => ({
    admin: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    productList: [],
    productData: null,

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null })
        await new Promise(resolve => setTimeout(resolve, 1000))
        try {
            const res = await axios.get(`${ADMIN_API_URL}/check-auth`)
            set({
                admin: res.data.user,
                isAuthenticated: true,
                isCheckingAuth: false
            })
        } catch (error) {
            set({
                error: null,
                isCheckingAuth: false,
                isAuthenticated: false
            })
        }
    },

    adminLogin: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axios.post(`${ADMIN_API_URL}/login`, {
                email,
                password
            })
            set({
                admin: res.data.admin,
                isAuthenticated: true,
                isLoading: false
            })
            return res.data
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error logging in admin",
                isLoading: false
            })
            throw error
        }
    },

    addProduct: async (submitData) => {
      
        set({ isLoading: true, error: null })
        try {
            const res = await axios.post(`${PRODUCT_API_URL}/add`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            set({
                productData: res.data.productData,
                isLoading: false
            })
            return res.data
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error adding product",
                isLoading: false
            })
            throw error
        }
    },

    listProducts: async () => {
        set({ error: null, isLoading: true })
        try {
            const res = await axios.get(`${PRODUCT_API_URL}/list`)
            set({ productList: res.data.productList, isLoading: false })
            return res.data.productList
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error listing products", isLoading: false
            })
            throw error
        }
    },

    deleteProduct: async (productId) => {
       
        set({ error: null })
        try {
            const res = await axios.delete(`${PRODUCT_API_URL}/${productId}`)
            return res.data.message
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error deleting product"
            })
            throw error
        }
    },
    adminGetProductById: async (productId) => {
        set({ isLoading: true })
        await new Promise(resolve => setTimeout(resolve, 1000))
        try {
            const response = await axios.get(`${ADMIN_API_URL}/product/${productId}`)
            set({ isLoading: false })
            return response.data
        } catch (error) {
            set({ isLoading: false })
            throw error
        }
    },
    adminLogout: async () => {
        set({ error: null })
        try {
            const res = await axios.post(`${ADMIN_API_URL}/logout`)
            set({
                admin: null,
                isAuthenticated: false,
                isCheckingAuth: false
            })
        } catch (error) {
            set({
                admin: null,
                isAuthenticated: false,
                isCheckingAuth: false
            })
            console.log(error)
        }
    },

}))

export default useAdminStore