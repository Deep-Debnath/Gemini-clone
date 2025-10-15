// const callback = (name, func) => {
//   console.log(name);
//   func();
// };
// const func = () => {
//   console.log("goodbye");
// };

// callback("deep", func);

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 5, 3];

// const duplicate = (arr) => {
//   let n = arr.length;
//   let newarr = [];
//   for (let i = 0; i < n; i++) {
//     for (let j = i + 1; j < n; j++) {
//       if (arr[i] === arr[j]) {
//         newarr.push(arr[i]);
//       }
//     }
//   }
//   console.log(newarr);
// };

// duplicate(arr);

console.log(arr.filter((v, i) => arr.indexOf(v) !== i));
