const greet__1 = (firstName) => {
  throw new Error("lastName required!");
};

const greet__2 = (firstName, lastName) => firstName + " " + lastName;

const greet__with__guard__2 = (type, firstName, lastName) => {
  console.log(`Greetings ${firstName} ${lastName}`);
};

const greet__with__guard__3 = (type, firstName, lastName) => {
  console.log(`${type} ${firstName} ${lastName}`);
};

const greet__guard__2 = (type) => type === "formal";

const greet__guard__3 = (type) => type === "informal";

const greet = function greet() {
  if (arguments.length === 1) {
    return greet__1.apply(undefined, arguments);
  }

  if (arguments.length === 2) {
    return greet__2.apply(undefined, arguments);
  }

  if (greet__guard__2.apply(undefined, arguments)) {
    return greet__with__guard__2.apply(undefined, arguments);
  }

  if (greet__guard__3.apply(undefined, arguments)) {
    return greet__with__guard__3.apply(undefined, arguments);
  }
};

//greet("a", "b");
greet("formal", "a", "b");
