import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import useForm from '../../hooks/useForm';
import { AuthContext } from '../../state/AuthContext';
import { showErrorToast } from '../../utils';
import { supabase } from '../../utils/supabaseClient';

const Auth = () => {
  const {
    state: { formType },
    dispatch,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const { form, handleChange, resetForm } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formType === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp(
        {
          email: form.email,
          password: form.password,
        },
        {
          data: {
            full_name: form.name,
          },
        }
      );

      if (signUpError) {
        showErrorToast(signUpError.message, setLoading);
        return;
      }

      // await supabase.from('user').insert([
      //   {
      //     name: form.name,
      //   },
      // ]);
    } else {
      const { error } = await supabase.auth.signIn({
        email: form.email,
        password: form.password,
      });

      if (error) {
        return showErrorToast(error.message, setLoading);
      }
    }

    toast.success(
      formType === 'signup'
        ? 'You have successfully signed up!'
        : 'You have successfully signed in!'
    );
    resetForm();
    setLoading(false);
    dispatch({ type: 'CLOSE_AUTH_MODAL' });
  };

  return (
    <div className="my-2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center gap-y-1"
      >
        {formType === 'signup' && (
          <>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
              placeholder="Your name"
              value={form.name}
              required={formType === 'signup'}
              onChange={handleChange}
              disabled={loading}
            />
          </>
        )}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
          value={form.email}
          required
          onChange={handleChange}
          disabled={loading}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          minLength={6}
          required
          className="p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
        />

        <button
          type="submit"
          className={`py-0.5 h-full text-lg w-full bg-black hover:text-black hover:bg-white border-black border text-white rounded
            ${loading ? 'cursor-not-allowed animate-pulse' : 'cursor-pointer'}
          `}
          disabled={loading}
        >
          {loading
            ? 'Loading...'
            : formType === 'signup'
            ? 'Sign up'
            : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

export default Auth;
