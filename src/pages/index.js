import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Product from '../components/Product';

const API_URL = `http://localhost:3000`;

const Home = () => {
  const [products, setProducts] = useState([]);

  const router = useRouter();

  useEffect(() => {
    async function getProducts() {
      const data = await axios.get(`${API_URL}/api/products`);
      console.log(data.data);
      setProducts(data.data);
    }
    getProducts();
  }, []);

  return (
    <Layout>
      <main>
        <section className="my-4 p-4 grid grid-cols-3 gap-6 lg:grid-cols-4">
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
