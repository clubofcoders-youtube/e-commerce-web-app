import Image from 'next/image';
import React, { useContext } from 'react';
import { CartContext } from '../../state/CartContext';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

const Product = (product) => {
  const { cartState, removeFromCart, addToCart } = useContext(CartContext);

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
      <div className="flex flex-col w-full space-x-0 space-y-2 lg:space-x-2 lg:space-y-0 lg:flex-row">
        <button className="py-0.5 h-full text-lg w-full bg-black hover:text-black hover:bg-white border-black border text-white rounded">
          Buy now
        </button>
        {!cartState[product.id] ? (
          <button
            className="py-0.5 h-full text-lg w-full bg-black hover:text-black hover:bg-white border-black border text-white rounded"
            onClick={() => addToCart(product)}
          >
            Add to cart
          </button>
        ) : (
          <div className="flex items-center justify-center w-full gap-x-4">
            <button
              className="py-0.5 h-full text-lg flex items-center justify-center w-full bg-black hover:text-black hover:bg-white border-black border text-white rounded"
              onClick={() => removeFromCart(product)}
            >
              <AiOutlineMinus />
            </button>
            {cartState[product.id]}
            <button
              className="py-0.5 h-full text-lg flex items-center justify-center w-full bg-black hover:text-black hover:bg-white border-black border text-white rounded"
              onClick={() => addToCart(product)}
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
