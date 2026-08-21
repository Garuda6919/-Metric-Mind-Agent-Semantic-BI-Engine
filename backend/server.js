require("dotenv").config();

const config = require("./src/config/config");

const app = require("./src/app");

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});