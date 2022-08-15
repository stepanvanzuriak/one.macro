# one.macro 

Collection of macros developed for learning purpose

## guard

### Trivial example

```js
import { guard } from 'one.macro';


function earlyReturn(value, flag) {
  guard(!value && !flag, "Required");
  guard(value > 12);

  return "Fine";
}

earlyReturn(10); // returns undefined
earlyReturn(100); // returns "Fine"
earlyReturn(); // returns "Required"

```

## overload

### Trivial example

```js
import { overload } from 'one.macro';

const greeting = overload(
  (name = 'John') => 'Hello, John!',
  (name = 'World') => 'Hello, World!',
  (name, lastName) => `Hello, ${name} ${lastName}!`,
  (any) => 'Hello anyway!', 
);

greeting('John'); // Hello, John!
greeting('World'); // Hello, World!
greeting('Matt', 'Doe'); // Hello, Matt Doe!
greeting(42); // Hello anyway!
```

### Custom when guard example

```js
import { overload, when } from 'one.macro';

const isJson = (kind, someStatus) => kind === "JSON" && someStatus > 100;
const isCSV = (kind, someStatus) => kind === "CSV" && someStatus > 150;
const statusGuard = (_, someStatus) => someStatus < 0

const dummyIdentifier = overload(
  when(
    isJson,
    () => "Yep, JSON"
  ),
  when(
    isCSV,
    () => "Yep, CSV"
  ),
  when(
    statusGuard,
    () => "Status code error"
  ),
  (any, someStatus) => "Unknown",
  (any) => "Status code required"
);

dummyIdentifier("JSON", 110); // Yep, JSON
dummyIdentifier("CSV", 160); // Yep, CSV
dummyIdentifier("JSON", -100); // Status code error
dummyIdentifier("XML"); // Status code required
dummyIdentifier("XML", 100); // Unknown

```

### Array sum example

```js
import { overload, when } from 'one.macro';

const sumList = overload(
  (list = [], acc) => acc,
  ([head, ...tail], acc) => sumList(tail, head + acc)
);

sumList([1, 2, 3], 0);  // 6
sumList([1, 2, 3], 6); // 12
sumList([], 100); // 100 
```

