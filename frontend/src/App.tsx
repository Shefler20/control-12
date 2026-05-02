import './App.css'
import {Container} from "@mui/material";
import {Route, Routes } from "react-router-dom";
import Home from "./containers/Home/Home";
import PageNotFound from "./containers/PageNotFound/PageNotFound.tsx";

const App = () => (
    <>
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home/>}/>

          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </Container>
    </>
);

export default App
