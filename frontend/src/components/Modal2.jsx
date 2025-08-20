import React from "react";
import { X } from "lucide-react";
import useShopStore from "../store/shopStore";

const Modal2 = ({ children }) => {
    const { showLoginModal2, setShowLoginModal2, setOpenWishList } = useShopStore();
    function handleClose() {
        setShowLoginModal2(false)
        setOpenWishList(false)

    }
    if (!showLoginModal2) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] sm:max-w-md rounded-lg shadow-lg relative p-6">

                {/* Close Button */}
                <button
                    onClick={() => handleClose()}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                    <X size={20} />
                </button>


                {children}
            </div>
        </div>
    );
};

export default Modal2;