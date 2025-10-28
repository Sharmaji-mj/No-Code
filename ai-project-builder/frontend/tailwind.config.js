// // module.exports = {
// //   content: [
// //     "./src/**/*.{js,jsx,ts,tsx}",
// //     "./src/**/*.{css}",
// //     "./public/index.html"
// //   ],
// //   theme: {
// //     extend: {},
// //     plugins: {
// //       tailwindcss: {},
// //       autoprefixer: {},
// //     },
// //   }
// // }

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//     "./src/**/*.css",
//     "./public/index.html"
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     require("tailwindcss"),
//     require("autoprefixer"),
//   ],
// // }
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx,css}", // combine CSS here
//     "./public/index.html"
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };




/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css}", // include CSS
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
