import { createContext, useEffect, useReducer } from 'react';
import { supabase } from '../utils/supabaseClient';

const intialAuthState = {
  isModalOpen: false,
  formType: 'login',
  session: null,
  userDetails: null,
};

export const AuthContext = createContext({
  state: intialAuthState,
  dispatch: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_AUTH_MODAL':
      return {
        ...state,
        formType: action.formType,
        isModalOpen: true,
      };
    case 'CLOSE_AUTH_MODAL':
      return {
        ...state,
        isModalOpen: false,
      };
    case 'LOGIN':
      return {
        ...state,
        session: action.session,
      };
    case 'LOGOUT':
      return {
        ...state,
        session: null,
      };
    case 'SET_USER_DETAILS':
      return {
        ...state,
        userDetails: action.userDetails,
      };
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, intialAuthState);

  useEffect(() => {
    dispatch({ type: 'LOGIN', session: supabase.auth.session() });
    supabase.auth.onAuthStateChange((event, session) => {
      dispatch({ type: 'LOGIN', session });
    });
  }, []);

  useEffect(() => {
    if (!supabase.auth.session()) return;
    (async () => {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('id', supabase.auth.session().user.id);
      if (error) return;
      dispatch({ type: 'SET_USER_DETAILS', userDetails: data[0] });
    })();
  }, [state.session]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
