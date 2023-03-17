import { extendTheme } from "@chakra-ui/react";

const config = {
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  colors: {
    brand: {
      50: "#002391",
      100: "#002391",
      200: "#002391",
      300: "#002391",
      400: "#002391",
      500: "#002391",
      600: "#002391",
      700: "#002391",
      800: "#002391",
      900: "#002391",
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      "&::-webkit-scrollbar": {
        width: "10px",
        height: "8px",
      },
      "&::-webkit-scrollbar-track": {
        borderRadius: "100vh",
        background: "#0022911c",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#002391",
        borderRadius: "100vh",
      },
    },
  },
};

const theme = extendTheme(config);

export default theme;

