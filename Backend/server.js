import app from "./index.js";
import { testConnection } from "./DB/DB.js";
import axios from "axios";

testConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server : ${process.env.PORT}`);
});




