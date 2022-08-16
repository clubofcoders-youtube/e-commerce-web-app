import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Product from '../components/Product';
import { ProductsContext } from '../state/ProductsContext';

const API_URL = `http://localhost:3000`;

const Home = () => {
  const { products, loading } = useContext(ProductsContext);

  return (
    <Layout>
      <main>
        <section className="grid grid-cols-3 gap-6 p-4 my-4 lg:grid-cols-4">
          {loading && <p>Loading...</p>}
          {products &&
            products.length > 0 &&
            products.map((product) => (
              <Product key={product.id} {...product} />
            ))}
        </section>
      </main>
    </Layout>
  );
};

export default Home;
