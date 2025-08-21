import { create } from "zustand"
import { toast } from "react-toastify"
import axios from "axios"
import { AUTH_API_URL, PRODUCT_API_URL, PAYMENT_API_URL } from '../config/api'


axios.defaults.withCredentials = true
const useShopStore = create((set, get) => ({
    currency: "₹",
    delivery_fee: 10,
    products: [],
    showLoginModal: false,
    showLoginModal2: false,
    showContactModal: false,
    openWishList: false,
    setOpenWishList: (value) => set({ openWishList: value }),
    setShowLoginModal: (value) => set({ showLoginModal: value }),
    setShowLoginModal2: (value) => set({ showLoginModal2: value }),
    setShowContactModal: (value) => set({ showContactModal: value }),
    visible: false,
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    userListings: [],
    listingsLoaded: false,
    showRedDot: false,
    setShowRedDot: (value) => set({ showRedDot: value }),
    setVisible: () => {
        set((state) => ({ visible: !state.visible }))
    },

    search: '',
    showSearch: false,
    setShowSearch: (value) => set({ showSearch: value }),
    setSearch: (inputValue) => {
        set({ search: inputValue })
    },









    listProducts: async () => {
        set({ error: null })
        try {
            const res = await axios.get(`${PRODUCT_API_URL}/list`)
            const productList = res.data.productList

            set({ products: productList })
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error listing products"
            })
            throw error
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null })
        try {
            const res = await axios.get(`${AUTH_API_URL}/check-auth`)
            set({
                user: res.data.user,
                isAuthenticated: true,
                isCheckingAuth: false
            })
        } catch (error) {
            set({
                error: null,
                isCheckingAuth: false,
                isAuthenticated: false,
                user: null
            })
        }
    },

    userSignIn: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axios.post(`${AUTH_API_URL}/login`, {
                email,
                password
            })
            set({
                user: res.data.user,
                isAuthenticated: true,
                isLoading: false,
                listingsLoaded: false
            })
            return res.data
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error signing in user",
                isLoading: false
            })
            throw error
        }
    },

    userSignUp: async (name, email, password) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axios.post(`${AUTH_API_URL}/signup`, {
                name,
                email,
                password
            })
            set({
                user: res.data.user,
                isAuthenticated: true,
                isLoading: false,
                listingsLoaded: false
            })
            return res.data
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error logging in user",
                isLoading: false
            })
            throw error
        }
    },

    updateUserProfile: async (formData) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axios.put(`${AUTH_API_URL}/edit-profile`, formData)
            set({
                user: res.data.user,
                isAuthenticated: true,
                isLoading: false,
            })
            return res.data
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error updating user profile",
                isLoading: false
            })
            throw error
        }
    },

    addProduct: async (submitData) => {
        console.log(submitData)
        set({ isLoading: true, error: null })
        try {
            const res = await axios.post(`${PRODUCT_API_URL}/add`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            set({
                productData: res.data.productData,
                isLoading: false,
                listingsLoaded: false
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

    getProductById: async (productId) => {
        set({ isLoading: true })
        try {
            const response = await axios.get(`${PRODUCT_API_URL}/${productId}`)
            set({ isLoading: false })
            return response.data.product
        } catch (error) {
            set({ isLoading: false })
            throw error
        }
    },

    getUserListings: async () => {
        const state = get()

        if (state.isLoading) {
            console.log("Already loading listings, skipping request")
            return state.userListings
        }

        if (state.listingsLoaded && state.userListings.length >= 0) {
            console.log("Using cached listings")
            return state.userListings
        }

        set({
            error: null,
            isLoading: true
        })

        try {
            const response = await axios.get(`${PRODUCT_API_URL}/my-listings`)
            const listings = response.data.myListedProducts || []

            set({
                error: null,
                isLoading: false,
                userListings: listings,
                listingsLoaded: true
            })

            return listings
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error loading products listed by user",
                isLoading: false,
                listingsLoaded: false
            })
            throw error
        }
    },

    refreshUserListings: async () => {
        set({ listingsLoaded: false })
        return get().getUserListings()
    },

    deleteProduct: async (productId) => {
        console.log("Deleting product:", productId)
        set({ error: null })
        try {
            const res = await axios.delete(`${PRODUCT_API_URL}/${productId}`)

            const currentListings = get().userListings
            const updatedListings = currentListings.filter(listing => listing._id !== productId)
            set({
                userListings: updatedListings,
                listingsLoaded: true
            })

            return res.data
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error deleting product"
            })
            throw error
        }
    },


    logout: async () => {
        try {
            await axios.post(`${AUTH_API_URL}/logout`)
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            set({
                user: null,
                isAuthenticated: false,
                userListings: [],
                listingsLoaded: false,
                showContactModal: false,
                showLoginModal2: false,
                showLoginModal: false,
                openWishList: false,
                showRedDot: false,
                error: null
            })
        }
    },
    handleMarkAsSold: async (id) => {
        try {
            await axios.post(`${PRODUCT_API_URL}/mark-sold`, {
                productId: id
            })
        } catch (error) {
            console.error("Logout error:", error)
        }
    },
    createRazorpayOrder: async () => {
        try {
            const response = await axios.post(`${PAYMENT_API_URL}/create-razorpay-order`, {
                amount: 49
            })

            return response.data
        } catch (error) {
            throw error
        }
    },
    verifyRazorpayPayment: async (paymentData) => {
        try {
            const response = await axios.post(`${PAYMENT_API_URL}/verify-razorpay-payment`, paymentData)
            return response.data
        } catch (error) {
            throw error
        }
    }


}))

export default useShopStore