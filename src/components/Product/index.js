import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { CartContext } from '../../state/CartContext';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';

const Product = (product) => {
  const { cartState, removeFromCart, addToCart } = useContext(CartContext);

  const [loading, setLoading] = useState(false);

  const handleCartOperation = async (operation) => {
    setLoading(true);
    await operation;
    setLoading(false);
  };

  return (
    <div
      className="flex flex-col p-4 space-y-2 transition transform border hover:scale-105 hover:border-black border-black/30"
      key={product.id}
    >
      <h3 className="text-xl font-semibold truncate">{product.name}</h3>
      <p className="truncate">{product.description}</p>
      <div className="relative aspect-video">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
      <p>
        <span className="text-gray-600">${product.price}</span>
      </p>
      <div className="flex flex-col w-full space-x-0 space-y-2 lg:justify-center lg:items-center lg:space-x-2 lg:space-y-0 lg:flex-row">
        <button className="p-2 text-lg text-white bg-black border border-black rounded hover:text-black hover:bg-white">
          Buy now
        </button>
        {!cartState[product.id] && !loading && (
          <button
            className="p-2 text-lg text-white bg-black border border-black rounded hover:text-black hover:bg-white"
            onClick={() => addToCart(product)}
            disabled={loading}
          >
            Add to cart
          </button>
        )}
        <div className="flex items-center justify-center">
          {loading && <FaSpinner className="w-full text-lg animate-spin" />}
        </div>
        {cartState[product.id] && !loading && (
          <div className="flex items-center justify-center gap-x-4">
            <button
              className="flex items-center justify-center p-2 text-lg text-white bg-black border border-black rounded hover:text-black hover:bg-white"
              onClick={() => handleCartOperation(removeFromCart(product))}
              disabled={loading}
            >
              <AiOutlineMinus />
            </button>
            {cartState[product.id]}
            <button
              className="flex items-center justify-center p-2 text-lg text-white bg-black border border-black rounded hover:text-black hover:bg-white"
              onClick={() => handleCartOperation(addToCart(product))}
              disabled={loading}
            >
              <AiOutlinePlus />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
