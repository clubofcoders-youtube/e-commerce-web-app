import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import useForm from '../../../hooks/useForm';
import { AuthContext } from '../../../state/AuthContext';
import { supabase } from '../../../utils/supabaseClient';

const ProductForm = () => {
  const { form, handleChange, resetForm } = useForm({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '',
  });

  const [loading, setLoading] = useState(false);
  const imageFileRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);

  const uploadImage = async () => {
    const imageName = `${Date.now()}-${imageFile.name}`;
    const { error } = await supabase.storage
      .from('products')
      .upload(`images/${imageName}`, imageFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) return toast.error(error.message);

    const { publicURL } = supabase.storage
      .from('products')
      .getPublicUrl(`images/${imageName}`);

    return new URL(publicURL).href;
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image.size > 2000000) {
      toast.error('Image size must be less than 2MB');
      return;
    }
    setImageFile(image);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    let publicUrl = '';
    if (imageFile) {
      publicUrl = await uploadImage();
    }

    const { data, error } = await supabase.from('product').insert([
      {
        name: form.name,
        price: form.price,
        description: form.description,
        image: publicUrl,
        stock: form.stock,
      },
    ]);

    if (error) return showErrorToast(error.message, setLoading);

    toast.success('Product added successfully');
    resetForm();
    imageFileRef.current.value = '';
    setLoading(false);
  };

  const {
    state: { userDetails },
  } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (userDetails?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [userDetails, router]);

  return (
    <form onSubmit={handleSubmitProduct} className="mx-auto space-y-2 w-96 ">
      <div className="w-full">
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          name="name"
          id="name"
          className="w-full p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
          placeholder="Product Name"
          onChange={handleChange}
          value={form.name}
          required
        />
      </div>

      <div>
        <label htmlFor="price">Product Price</label>
        <input
          type="number"
          name="price"
          id="price"
          className="w-full p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
          placeholder="Product Price"
          onChange={handleChange}
          value={form.price}
          required
        />
      </div>

      <div>
        <label htmlFor="stock">Product Stock</label>
        <input
          type="number"
          name="stock"
          id="stock"
          className="w-full p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
          placeholder="Product Stock"
          onChange={handleChange}
          value={form.stock}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Product Description</label>
        <input
          type="text"
          name="description"
          id="description"
          className="w-full p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
          placeholder="Product Description"
          onChange={handleChange}
          value={form.description}
        />
      </div>

      <div>
        <label htmlFor="image">Product Image</label>
        <input
          accept="image/*"
          type="file"
          name="image"
          id="image"
          ref={imageFileRef}
          onChange={handleImageChange}
        />
      </div>

      <button
        type="submit"
        className={`py-0.5 h-full text-lg w-full bg-black hover:text-black hover:bg-white border-black border text-white rounded
            ${loading ? 'cursor-not-allowed animate-pulse' : 'cursor-pointer'}
          `}
      >
        Submit
      </button>
    </form>
  );
};

export default ProductForm;
