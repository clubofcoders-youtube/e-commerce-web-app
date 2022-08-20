import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../state/AuthContext';
import { CartContext } from '../../state/CartContext';
import { supabase } from '../../utils/supabaseClient';
import Auth from '../Auth';
import Modal from '../Modal';

const Layout = ({ children }) => {
  const router = useRouter();

  const {
    state: { isModalOpen, formType, session, userDetails },
    dispatch,
  } = useContext(AuthContext);

  const { totalCartItems } = useContext(CartContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="flex flex-col w-full h-full">
      <header className="flex items-center justify-end w-full h-32 px-4 space-x-4 bg-gray-200">
        <div className="mr-auto text-2xl font-light select-none">
          <Link href="/">E-Commerce web app with Next.js</Link>
        </div>
        {!session && (
          <>
            <div className="">
              <button
                className="px-4 py-2 text-lg text-white bg-black border border-black rounded hover:text-black hover:bg-white"
                onClick={() =>
                  dispatch({
                    type: 'OPEN_AUTH_MODAL',
                    formType: 'signup',
                  })
                }
              >
                Sign up
              </button>
            </div>
            <div className="">
              <button
                className="px-4 py-2 text-lg text-white bg-black border border-black rounded hover:text-black hover:bg-white"
                onClick={() =>
                  dispatch({
                    type: 'OPEN_AUTH_MODAL',
                    formType: 'login',
                  })
                }
              >
                Log In
              </button>
            </div>
          </>
        )}
        {session && (
          <>
            {userDetails?.role === 'ADMIN' && (
              <div className="">
                <button
                  className="px-4 py-2 text-lg text-white bg-black border border-black rounded hover:text-black hover:bg-white"
                  onClick={() => router.push('/admin')}
                >
                  Admin
                </button>
              </div>
            )}
            <div className="">
              <button
                className="px-4 py-2 text-lg text-white bg-black border border-black rounded hover:text-black hover:bg-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
            <div className="">
              <button
                className="px-4 py-2 text-lg text-white bg-black border border-black rounded hover:text-black hover:bg-white"
                onClick={() => router.push('/cart')}
              >
                Cart - {totalCartItems}
              </button>
            </div>
          </>
        )}
      </header>
      <Modal
        isOpen={isModalOpen}
        closeModal={() =>
          dispatch({
            type: 'CLOSE_AUTH_MODAL',
          })
        }
        title="Welcome"
      >
        <Auth />
      </Modal>
      {children}
    </div>
  );
};

export default Layout;
