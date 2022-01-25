import { overload, when } from "./one.macro.js";

const isJohnSnow = (_, firstName, lastName) => firstName === "John" && lastName === "Snow"

const greet = overload(
  (type = "formal", firstName, lastName) => {
    console.log(`Greetings ${firstName} ${lastName}`);
  },
  (type = "informal", firstName, lastName) => {
    console.log(`Hi ${firstName} ${lastName}`);
  },
  when(
    isJohnSnow,
    () => {
      console.log("Winter is coming!");
    }
  )
);
