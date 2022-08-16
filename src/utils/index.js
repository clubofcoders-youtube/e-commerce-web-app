export const showErrorToast = (errorMessage, setLoading) => {
  toast.error(errorMessage);
  setLoading(false);
};
