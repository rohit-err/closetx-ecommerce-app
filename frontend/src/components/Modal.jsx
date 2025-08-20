import React from "react";
import { X } from "lucide-react";
import useShopStore from "../store/shopStore";

const Modal = ({ children }) => {
    const { showContactModal, setShowContactModal, showLoginModal, setShowLoginModal } = useShopStore();
    if (!showLoginModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] sm:max-w-md rounded-lg shadow-lg relative p-6">


                <button
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                    <X size={20} />
                </button>


                {children}
            </div>
        </div>
    );
};

export default Modal;

