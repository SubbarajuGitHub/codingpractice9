const express = require("express");
const app = express();

const bcrypt = require("bcrypt");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const dataBasePath = path.join(__dirname, "userData.db");

let DataBase = null;

app.use(express.json());

const ServerUpdateData = async () => {
    try {
        DataBase = await open({
            filename: dataBasePath,
            driver: sqlite3.Database
        });
        app.listen(3000, (request, response) => {
            console.log("Running local host now")
        });
    }
    catch (error) {
        console.log(`DB: Error "${error.messege}"`);
        process.exit(1);
    }
};
ServerUpdateData();

//API Register

app.post("/register/", async (request, response) => {
    const { username, name, password, gender, location } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const CheckQuery = `
    SELECT
    *
    FROM
    user
    WHERE username="${username}"`
    const dbUser = await DataBase.get(CheckQuery);
    if (dbUser === undefined) {
        if (password.length < 5) {
            response.status(400);
            response.send("Password is too short")
        }
        else {
            const createUserQuery = `
            INSERT INTO 
            user (username, name, password, gender, location) 
            VALUES 
        (
          '${username}', 
          '${name}',
          '${hashedPassword}', 
          '${gender}',
          '${location}'
        )`;
            const dbResponse = await DataBase.run(createUserQuery);
            response.status(200);
            response.send("User created successfully");
        }
    }
    else {
        response.status(400);
        response.send("User already exists")
    }
});



module.exports = app;

