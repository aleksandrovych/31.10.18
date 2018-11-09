const compose = (...fns) => (...args) => {
  if (fns.length === 0) return args[0];
  const fn = fns.shift();
  const res = fn(...args);
  if (fns.length === 0) return res;
  return compose(...fns)(res);
};

export default compose;
