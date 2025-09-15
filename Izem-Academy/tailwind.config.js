/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandYellow: "#F1BF5A",   // for icons
        mainRed: "#FD6C75",
        brandBg: "#FFD686",   
        primary: {
      DEFAULT: "#1296B3", // base
      hover: "#0F7A91",   // hover
    },
customBlue: "rgba(229, 248, 255, 0.69)",
inactive: "#1D2939",
        border:"#e4e2e2",
        main:'#FF3D00', 
        mainDarkColor:"#101828",
        secondDarkColor:"#646464",
        geryWhite:"#e3e3e3",
        principal: "#fbf9f9",
        customOrange: '#FF3D00',
        customBrown: '#992500', 
        paragraphe:' #606060',
        bgColor:'#f5f7fa',
        darkGrey:"#696879",
        textModal:"#4B4B4B"
      },
      fontFamily: {
        fugaz: ["Fugaz One"],
        roboto:["Roboto"],
        raleway: ["Raleway"],  
        Open:["Open Sans"],
        montserrat:["Montserrat"],
        inter:["Inter"],
        tajawal:["Tajawal"],
        source:["Source Sans Pro"],
        poppins:["Poppins"]



      },
      backgroundImage:{
        'custom-gradient': 'linear-gradient(to right, #FF3D00, #992500)',
      },
      fontWeight: {
        'normal-400': 400, 
      },
    },
  },
  plugins: [],
}

