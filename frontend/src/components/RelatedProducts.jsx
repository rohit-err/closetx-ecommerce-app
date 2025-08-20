
import React from 'react'
import { useState, useEffect } from 'react'
import useShopStore from '../store/shopStore'
import Title from "./Title"
import ProductItem from './ProductItem'
const RelatedProducts = ({ category, subCategory }) => {

    const { products } = useShopStore()
    const [related, setRelated] = useState([])
    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = [...products]

            productsCopy = productsCopy.filter(product => (
                (product.category === category) && (product.subCategory === subCategory)
            ))

            setRelated(productsCopy.slice(0, 5))
        }
    }, [products, category, subCategory])

    return related.length > 0 ? (
        <div className="my-24">
            <div className="text-center text-3xl py-2">
                <Title text1={'RELATED'} text2={'PRODUCTS'} />
            </div>
            <div className="grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 ">
                {related.map((item, index) => (
                    <ProductItem key={item._id}
                        id={item._id}
                        name={item.name}
                        price={item.price}
                        img={item.images}
                        condition={item.condition}
                        size={item.size}
                        brand={item.brand}       
                        status={item.status}
                        listedAt={item.listedAt}
                        sellerName={item.userId.name} 
                        userId={item.userId} />
                ))}
            </div>
        </div>
    ) : null
}

export default RelatedProducts