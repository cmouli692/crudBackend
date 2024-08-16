const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()
const app = express()

app.use(cors()) // do from this

app.use(express.json())


const port = 3001 

// Initialize SQLite database

let db = new sqlite3.Database("./mydatabase.db",err => {
    if(err){
        console.error(err.message)
    }
    console.log("connected to the in-memory SQLITE database.")
})

// CREATE USER TABLE 

const createUserTableQuery = `CREATE TABLE IF  NOT EXISTS user (id INTEGER PRIMARY KEY,
username TEXT NOT NULL UNIQUE, password TEXT NOT NULL)`

db.run(createUserTableQuery,(err) => {
    if(err){
        console.error("Error creating user table:",err.message)
    }else{
        console.log("User table created successfully")
    }
})

const createUserSecondTableQuery = `CREATE TABLE IF  NOT EXISTS userTable2 (id INTEGER PRIMARY KEY,
username TEXT, password TEXT)`

db.run(createUserSecondTableQuery,(err) => {
    if(err){
        console.error("Error creating user table:",err.message)
    }else{
        console.log("User table 2 created successfully")
    }
})

// app.get("/",(request,response) => {
//     response.send("Hello world!")
// })

app.post("/",(request,response) => {
    const {username,password} = request.body
    console.log(username)
    console.log("request body : ", request.body)

    if(!username || !password){
        return response.status(400).send("username and password are required")
    }

    const insertIntoUserTableQuery = `INSERT INTO userTable2 (username,password) VALUES (?,?);`;

    db.run(insertIntoUserTableQuery,[username,password] ,function(err){
        if(err){
            console.error("Error inserting data:",err.message)
            return response.status(500).send("Error inserting user")
        }

        response.status(201).send(`User add with ID: ${this.lastID}`);
    })
})


app.get("/",async(request,response) => {
    try {
        const getUserDetailsQuery = `SELECT * FROM userTable2;`;

        // properly handle the query with a Promise

        const userDetails  = await new Promise((resolve,reject) => {
            db.all(getUserDetailsQuery,(err,rows) => {
                if(err){
                     reject(err); // If there's an error, reject the promise
                }else{
                    resolve(rows)  // Resolve the promise with the rows returned by the query
                }
            })
        })

        // Send the fetched user data as response

        response.send(userDetails);

        // Log the user details to the console for debugging

        console.log(userDetails)
        
    } catch (error) {

        console.error("Error fetching user details:",error.message)
        response.status(500).send("An error occurred while fetching the user details.")
        
    }
})

// app.get("/", async (request, response) => {
//     try {
//         const getUserDetailsQuery = `SELECT * FROM userTable2;`;

//         // Properly handle the query with a Promise
//         const userDetails = await new Promise((resolve, reject) => {
//             db.all(getUserDetailsQuery, (err, rows) => {
//                 if (err) {
//                     reject(err);  // If there's an error, reject the promise
//                 } else {
//                     resolve(rows); // Resolve the promise with the rows returned by the query
//                 }
//             });
//         });

//         // Send the fetched user details as the response
//         response.send(userDetails);

//         // Log the user details to the console for debugging
//         console.log("User details:", userDetails);
//     } catch (error) {
//         // Handle any errors that occur during the database operation
//         console.error("Error fetching user details:", error.message);
//         response.status(500).send("An error occurred while fetching user details.");
//     }
// });


// app.get("/", async (request,response) =>{


//     try {
//         const getUserDetailsQuery = `SELECT * FROM userTable2;`
//         const userDetails = await db.all(getUserDetailsQuery)

//         response.send(userDetails)
//         console.log("user details " ,userDetails)
//     } catch (err) {

//         //Log the error if something goes wrong

//         console.error("Error fetching user : " ,err.message)

//         response.status(500).send("An error occurred while fetching user details")
        
//     }

   
// })


app.listen(port , () => {
    console.log(`Server is running at http://localhost:${port}/`)
})