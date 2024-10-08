import { Routes, Route } from "react-router-dom";
import Update_TypesenseCM from "./Pages/Update_TypesenseCM";
import WRONG_ISIN_TS_CP from "./Pages/WRONG_ISIN_TS_CP";
import WRONG_ISIN_CP_SM from "./Pages/WRONG_ISIN_CP_SM";
import MisMatch_PCP_LCP from "./Pages/MisMatch_PCP_LCP";
import MerlinToNova from "./Pages/MerlinToNova";
import { Toaster } from "react-hot-toast";
import TS_Search from "./Pages/TS_Search";
import Navbar from "./Components/Navbar";
import Search from "./Pages/Search";
import Footer from "./Components/Footer";
import "./index.css";
import MismatchReport_CmMerlin_TSComplience from "./Pages/MismatchReport_CmMerlin_TSComplience";

export const URL = "http://localhost:5000";

function App() {
  return (
    <>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<TS_Search />} />
        <Route path="/searchTS" element={<WRONG_ISIN_TS_CP />} />
        <Route path="/search" element={<Search />} />
        <Route path="/isin" element={<WRONG_ISIN_CP_SM />} />
        <Route path="/prodCPlambdaCP" element={<MisMatch_PCP_LCP />} />
        {/* <Route path="/keep/Nova_Helper/searchTS" element={<TS_Search />} /> */}
        <Route path="/fixts" element={<Update_TypesenseCM />} />
        <Route path="/merlinTonova" element={<MerlinToNova />} />
        <Route
          path="/mismatchReports"
          element={<MismatchReport_CmMerlin_TSComplience />}
        />
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

export default App;
