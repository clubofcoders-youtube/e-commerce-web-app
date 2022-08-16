const useLocalStorage = (key) => {
  const getItem = () => {
    const localItem = localStorage.getItem(key);
    if (localItem) {
      return JSON.parse(localItem);
    }
    return null;
  };

  const setItem = (value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const removeItem = () => {
    localStorage.removeItem(key);
  };

  return {
    getItem,
    setItem,
    removeItem,
  };
};

export default useLocalStorage;
