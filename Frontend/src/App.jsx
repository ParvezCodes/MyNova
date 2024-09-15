import { Routes, Route } from "react-router-dom";
import WRONG_ISIN_TS_CP from "./Pages/WRONG_ISIN_TS_CP";
import Navbar from "./Components/Navbar";
import { Toaster } from "react-hot-toast";
import Search from "./Pages/Search";
import MisMatch_PCP_LCP from "./Pages/MisMatch_PCP_LCP";
import WRONG_ISIN_CP_SM from "./Pages/WRONG_ISIN_CP_SM";
import SingleShariahStatus from "./Pages/SingleShariahStatus";
import "./index.css";

export const URL = "http://localhost:5000";

function App() {
  return (
    <>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<WRONG_ISIN_TS_CP />} />
        <Route path="/search" element={<Search />} />
        <Route path="/isin" element={<WRONG_ISIN_CP_SM />} />
        <Route path="/prodCPlambdaCP" element={<MisMatch_PCP_LCP />} />
        <Route path="/SingleShariahStatus" element={<SingleShariahStatus />} />
      </Routes>
    </>
  );
}

export default App;
