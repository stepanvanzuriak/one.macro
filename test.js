import { overload, when } from "./one.macro.js";

const greet = overload(
  (firstName, lastName) => firstName + " " + lastName,
  when(
    (type) => type === "formal",
    (_, firstName, lastName) => {
      console.log(`Greetings ${firstName} ${lastName}`);
    }
  ),
  when(
    (type) => type === "informal",
    (_, firstName, lastName) => {
      console.log(`Hi ${firstName} ${lastName}`);
    }
  )
);
