import React, { useState, useEffect } from 'react'
import useShopStore from '../store/shopStore'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products, search, showSearch, listProducts } = useShopStore()

  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [displayProducts, setDisplayProducts] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSubCategories, setSelectedSubCategories] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [selectedSort, setSelectedSort] = useState("relevant")


  useEffect(() => {
    if (products.length === 0) {
      listProducts()
    }
  }, [])

  
  useEffect(() => {
    setFilteredList(products)
  }, [products])

  useEffect(() => {
    applyFilters()
  }, [selectedCategories, selectedSubCategories, products])

  useEffect(() => {
    handleSorting()
  }, [filteredList, selectedSort, search, showSearch])

  const toggleFilterVisibility = () => {
    setIsFilterVisible(prev => !prev)
  }

 
  const applyFilters = () => {
    const updatedProducts = products.filter(product =>
      (selectedCategories.length === 0 || selectedCategories.includes(product.category)) &&
      (selectedSubCategories.length === 0 || selectedSubCategories.includes(product.subCategory))
    );
    setFilteredList(updatedProducts);
  }

  const handleCategoryFilter = (e) => {
    const category = e.target.value;

    const updatedCategories = e.target.checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((item) => item !== category);

    setSelectedCategories(updatedCategories);
   
  };

  const handleSubCategoryFilter = (e) => {
    const subCategory = e.target.value;

    const updatedSubCategories = e.target.checked
      ? [...selectedSubCategories, subCategory]
      : selectedSubCategories.filter(item => item !== subCategory)

    setSelectedSubCategories(updatedSubCategories);
    
  };

  const handleSorting = () => {
    let updatedProducts = [...filteredList]

    if (search && showSearch) {
      updatedProducts = updatedProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (selectedSort === "low-high") {
      updatedProducts.sort((a, b) => a.price - b.price)
    }
    else if (selectedSort === "high-low") {
      updatedProducts.sort((a, b) => b.price - a.price)
    }

    setDisplayProducts(updatedProducts)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
          FILTERS
          <img
            onClick={toggleFilterVisibility}
            className={`h-3 sm:hidden ${isFilterVisible ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${isFilterVisible ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input type="checkbox" value="Men" onChange={handleCategoryFilter} className="w-3" />Men
            </p>
            <p className="flex gap-2">
              <input type="checkbox" value="Women" onChange={handleCategoryFilter} className="w-3" />Women
            </p>
            <p className="flex gap-2">
              <input type="checkbox" value="Kids" onChange={handleCategoryFilter} className="w-3" />Kids
            </p>
          </div>
        </div>

        <div className={`border border-gray-300 pl-5 py-3 my-5 ${isFilterVisible ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input onChange={handleSubCategoryFilter} type="checkbox" value="Topwear" className="w-3" />Topwear
            </p>
            <p className="flex gap-2">
              <input onChange={handleSubCategoryFilter} type="checkbox" value="Bottomwear" className="w-3" />Bottomwear
            </p>
            <p className="flex gap-2">
              <input onChange={handleSubCategoryFilter} type="checkbox" value="Winterwear" className="w-3" />Winterwear
            </p>
            <p className="flex gap-2">
              <input onChange={handleSubCategoryFilter} type="checkbox" value="Footwear" className="w-3" />Footwear
            </p>
            <p className="flex gap-2">
              <input onChange={handleSubCategoryFilter} type="checkbox" value="Accessories" className="w-3" />Accessories
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            onChange={(e) => { setSelectedSort(e.target.value) }}
            value={selectedSort}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {displayProducts.filter(product => {
            if (product.status === "available") return true
            if (product.status === "sold" && product.soldAt) {
              const daysSold = (new Date() - new Date(product.soldAt)) / (1000 * 60 * 60 * 24);
              return daysSold <= 3
            }
            return false
          }).map((product) => (
            <ProductItem
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
              sellerName={product.userId?.name || 'Unknown'}
              userId={product.userId}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collection