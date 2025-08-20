





import React, { useEffect, useState } from 'react'
import useShopStore from '../store/shopStore'
import Title from './Title'
import ProductItem from './ProductItem'
const LatestCollection = () => {
    const { products } = useShopStore()

    const [latestProducts, setLatestProducts] = useState([])
    useEffect(() => {
        if (products.length > 0) {
            const sorted = [...products].sort(
                (a, b) => new Date(b.listedAt) - new Date(a.listedAt)
            );
            setLatestProducts(sorted.slice(0, 10)); 
        }

    }, [products])


    return (
        <div className="my-10">
            <div className="text-center py-8 text-3xl">
                <Title text1={'LATEST'} text2={'COLLECTIONS'} />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    From essentials to rare finds — explore pre-loved drops, sustainable and styled for you.
                </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {latestProducts.map((product) => {
                    return <ProductItem
                        key={product._id}
                        id={product._id}
                        name={product.name}
                        price={product.price}
                        img={product.images}
                        condition={product.condition}
                        size={product.size}
                        brand={product.brand}
                        status={product.status}
                        listedAt={product.listedAt}
                        sellerName={product.userId.name}
                        userId={product.userId}
                    />
                })}
            </div>
        </div>
    )
}

export default LatestCollection