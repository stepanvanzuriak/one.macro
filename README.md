## Posible "guardless" solution 

```js
const greet = overload(
  (firstName, lastName) => firstName + " " + lastName,
  
  (type = "formal", firstName, lastName) => {
      console.log(`Greetings ${firstName} ${lastName}`);
  },
  
  (type = "informal", firstName, lastName) => {
      console.log(`Hi ${firstName} ${lastName}`);
  },
  
  ({type = "informal", b, c}) => {
	return b + c;
 },
);
```
