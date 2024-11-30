export const scaned = () => {
  const value = window.localStorage.getItem("scaned");
  return value ? Boolean(value) : false;
};

export const setScaned = (value: boolean) => {
  window.localStorage.setItem("scaned", value ? "true" : "");
};
