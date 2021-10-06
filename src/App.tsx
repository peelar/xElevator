import "./App.css";
import { Elevator } from "./Elevator";

import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <main>
        <Elevator />
      </main>
    </ChakraProvider>
  );
}

export default App;
