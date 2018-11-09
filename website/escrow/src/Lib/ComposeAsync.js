const reduceAsync = (items, performer, done, initialValue) => {
  const nseted = initialValue === undefined;
  let counter = nseted ? 1 : 0;
  let previous = nseted ? items[0] : initialValue;
  let current = nseted ? items[1] : items[0];

  const response = (err, data) => {
    if (!err && counter !== items.length - 1) {
      counter++;
      previous = data;
      current  = items[counter];
      performer(previous, current, response, counter, items);
    } else if (done) {
      done(err, data);
    }
  };

  performer(previous, current, response, counter, items);
};

const last = arr => arr[arr.length - 1];

// funcs - array of parametrs for functions
// args - array of functions
// args[i] - function
// args[-1] - done(err, data)
//
const composeAsync = (funcs, ...args) => (
  () => reduceAsync(
    args.slice(0, -1),
    (params, fn, done) => fn(...[].concat(params).concat(done)),
    last(args),
    funcs
  )
);

export default composeAsync;
