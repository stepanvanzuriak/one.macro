import {overload} from "./one.macro.js"


const a = overload(
    a => a, 
    (a, b) => a + b
);