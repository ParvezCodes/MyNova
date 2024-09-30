import app from "./index.js";
import { testConnection } from "./DB/DB.js";
import { testConnectionNovaProd } from "./DB/NovaProd_DB.js";

testConnection();
testConnectionNovaProd();

app.listen(process.env.PORT, () => {
  console.log(`Server : ${process.env.PORT}`);
});
