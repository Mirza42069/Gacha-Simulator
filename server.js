// Full-stack example to demonstrate route and function flow
// Frontend (client-side JavaScript)
/*
// This would typically be in an HTML file or a separate JS file
document.getElementById('createUserBtn').addEventListener('click', async () => {
    // When button is clicked, this function runs first
    console.log('Button clicked: Preparing to create user');

    // Generate arbitrary user data
    const userData = {
        name: `User ${Math.floor(Math.random() * 1000)}`,
        email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        age: Math.floor(Math.random() * 50) + 18
    };

    try {
        // Send POST request to the server
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        // Handle the response from the server
        const result = await response.json();
        console.log('Server response:', result);
    } catch (error) {
        console.error('Error creating user:', error);
    }
});
*/

// Backend (Node.js Express + MongoDB)
const express = require('express');
const { MongoClient } = require('mongodb');

const path = require('path');  // Ensures path name compatibility across different operating systems
const app = express();

app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from 'public' directory automatically,
														  // with __dirname being the global directory of current module
app.use(express.json());

// Connection details
const uri = "mongodb://localhost:27017";
const dbName = "user_flow_demo";

/*
// Detailed logging to show the exact flow
async function createUser(client, userData) {
    console.log('1. createUser function started');
    
    try {
        const database = client.db(dbName);
        const users = database.collection("users");
        
        console.log('2. Attempting to insert user data');
        const result = await users.insertOne(userData);
        
        console.log('3. User created successfully');
        console.log('   - Inserted ID:', result.insertedId);
        
        return result;
    } catch (error) {
        console.error('4. Error in createUser function:', error);
        throw error;
    }
}

// Express route handling
app.post('/users', async (req, res) => {
    console.log('A. Express route /users called');
    
    // This is the connection client for the route
    let client;
    try {
        // Establish MongoDB connection
        console.log('B. Connecting to MongoDB');
        client = new MongoClient(uri);
        await client.connect();
        
        // Get the user data from the request
        const userData = req.body;
        console.log('C. Received user data:', userData);
        
        // Call the createUser function
        console.log('D. Calling createUser function');
        const result = await createUser(client, userData);
        
        // Send successful response
        console.log('E. Sending response back to client');
        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertedId
        });
    } catch (error) {
        console.error('F. Error in route handler:', error);
        
        // Send error response
        res.status(500).json({
            message: 'Error creating user',
            error: error.toString()
        });
    } finally {
        // Always close the connection
        if (client) {
            console.log('G. Closing MongoDB connection');
            await client.close();
        }
    }
});
*/

// Create pull history
async function createPullHistory(client, pullData) {
    console.log('1. createPullHistory function started');
    
    try {
        const database = client.db(dbName);
        const pullHistories = database.collection("pull_histories");
        
        console.log('2. Attempting to insert pull history');
        const result = await pullHistories.insertOne(pullData);
        
        console.log('3. Pull history created successfully');
        console.log('   - Inserted ID:', result.insertedId);
        
        return result;
    } catch (error) {
        console.error('4. Error in createPullHistory function:', error);
        throw error;
    }
}

// Get pull history for a username
async function getPullHistory(client, username) {
    console.log('1. getPullHistory function started');
    
    try {
        const database = client.db(dbName);
        const pullHistories = database.collection("pull_histories");
        
        console.log('2. Retrieving pull history for username');
        const query = { username: username };
        const result = await pullHistories.find(query).toArray();
        
        console.log('3. Pull history retrieved successfully');
        return result;
    } catch (error) {
        console.error('4. Error in getPullHistory function:', error);
        throw error;
    }
}

// Update pull history
async function updatePullHistory(client, pullId, updateData) {
    console.log('1. updatePullHistory function started');
    
    try {
        const database = client.db(dbName);
        const pullHistories = database.collection("pull_histories");
        
        console.log('2. Attempting to update pull history');
        const result = await pullHistories.updateOne(
            { _id: new ObjectId(pullId) },
            { $set: updateData }
        );
        
        console.log('3. Pull history updated successfully');
        return result;
    } catch (error) {
        console.error('4. Error in updatePullHistory function:', error);
        throw error;
    }
}

// POST route to create pull history
app.post('/pull-history', async (req, res) => {
    console.log('A. Express route /pull-history called');
    
    let client;
    try {
        console.log('B. Connecting to MongoDB');
        client = new MongoClient(uri);
        await client.connect();
        
        const pullData = req.body;
        console.log('C. Received pull data:', pullData);
        
        console.log('D. Calling createPullHistory function');
        const result = await createPullHistory(client, {
            username: pullData.username,
			timestamp: pullData.timestamp,
            pulls: pullData.pulls
        });
        
        console.log('E. Sending response back to client');
        res.status(201).json({
            message: 'Pull history created successfully',
            pullHistoryId: result.insertedId
        });
    } catch (error) {
        console.error('F. Error in route handler:', error);
        
        res.status(500).json({
            message: 'Error creating pull history',
            error: error.toString()
        });
    } finally {
        if (client) {
            console.log('G. Closing MongoDB connection');
            await client.close();
        }
    }
});

// GET route to retrieve pull history
app.get('/pull-history/:username', async (req, res) => {
    console.log('A. Express route /pull-history/:username called');
    
    let client;
    try {
        console.log('B. Connecting to MongoDB');
        client = new MongoClient(uri);
        await client.connect();
        
        const username = req.params.username;
        console.log('C. Retrieving pull history for username:', username);
        
        console.log('D. Calling getPullHistory function');
        const result = await getPullHistory(client, username);
        
        console.log('E. Sending response back to client');
        res.status(200).json({
            message: 'Pull history retrieved successfully',
            pullHistory: result
        });
    } catch (error) {
        console.error('F. Error in route handler:', error);
        
        res.status(500).json({
            message: 'Error retrieving pull history',
            error: error.toString()
        });
    } finally {
        if (client) {
            console.log('G. Closing MongoDB connection');
            await client.close();
        }
    }
});

// PUT route to update pull history
app.put('/pull-history/:id', async (req, res) => {
    console.log('A. Express route /pull-history/:id called');
    
    let client;
    try {
        console.log('B. Connecting to MongoDB');
        client = new MongoClient(uri);
        await client.connect();
        
        const pullId = req.params.id;
        const updateData = req.body;
        console.log('C. Updating pull history with ID:', pullId);
        
        console.log('D. Calling updatePullHistory function');
        const result = await updatePullHistory(client, pullId, updateData);
        
        console.log('E. Sending response back to client');
        res.status(200).json({
            message: 'Pull history updated successfully',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('F. Error in route handler:', error);
        
        res.status(500).json({
            message: 'Error updating pull history',
            error: error.toString()
        });
    } finally {
        if (client) {
            console.log('G. Closing MongoDB connection');
            await client.close();
        }
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Explanation of the flow:
/*
When the button is clicked on the client-side:
1. Client-side JavaScript generates user data
2. Sends a POST request to '/users' endpoint
3. Express route handler is triggered

Express route handler steps:
A. Route is called
B. Connects to MongoDB
C. Receives user data from request
D. Calls createUser function
E. Sends response back to client
F. Handles any errors
G. Closes MongoDB connection

The createUser function:
1. Receives the client connection
2. Inserts user data into the database
3. Returns the result of the insertion
*/


/*
// ================= INITIAL SETUP =================
// Import the MongoClient class from the mongodb package
// This is the main class we use to interact with MongoDB
const { MongoClient } = require('mongodb');

// Import express framework for creating REST API endpoints
// Express makes it easy to create a web server and handle HTTP requests
const express = require('express');

// Initialize express application
const app = express();

// Middleware to parse JSON bodies
// This allows us to read JSON data from incoming requests
app.use(express.json());

// ================= DATABASE CONFIGURATION =================
// The connection string for MongoDB
// Format: mongodb://[username:password@]host:port
// For local MongoDB, we use localhost:27017 (default MongoDB port)
const uri = "mongodb://localhost:27017";

// Name of the database we'll be using
// MongoDB will create this database automatically if it doesn't exist
const dbName = "beginner_db";

// ================= DATABASE CONNECTION =================
// Async function to connect to MongoDB
// We use async/await for cleaner handling of promises
async function connectToMongo() {
    try {
        // Create a new MongoClient instance
        const client = new MongoClient(uri);
        
        // Establish connection to MongoDB
        // This returns a promise which we await
        await client.connect();
        console.log("Connected to MongoDB!");
        
        // Return the connected client for use in other functions
        return client;
    } catch (error) {
        // If connection fails, log the error and throw it
        console.error("Connection error:", error);
        throw error;
    }
}

// ================= CRUD OPERATIONS =================

// CREATE - Insert a single document
async function createUser(client, userData) {
    try {
        // Get reference to the database
        const database = client.db(dbName);
        
        // Get reference to the 'users' collection
        // If the collection doesn't exist, MongoDB will create it
        const users = database.collection("users");
        
        // Insert one document into the collection
        // insertOne() returns an object containing the ID of the inserted document
        const result = await users.insertOne(userData);
        console.log(`Created user with id: ${result.insertedId}`);
        return result;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

// READ - Find documents
// The query parameter is optional and defaults to an empty object
// An empty query {} matches all documents in the collection
async function findUsers(client, query = {}) {
    try {
        const database = client.db(dbName);
        const users = database.collection("users");
        
        // find() returns a cursor (a pointer to the result set)
        // We can iterate over the cursor or convert it to an array
        const cursor = users.find(query);
        
        // Convert cursor to array and return all matching documents
        return await cursor.toArray();
    } catch (error) {
        console.error("Error finding users:", error);
        throw error;
    }
}

// UPDATE - Update a document
async function updateUser(client, userId, updateData) {
    try {
        const database = client.db(dbName);
        const users = database.collection("users");
        
        // updateOne takes two main arguments:
        // 1. Filter: Which document to update ({ _id: userId })
        // 2. Update operation: What to update ({ $set: updateData })
        // $set is an update operator that replaces the value of fields
        const result = await users.updateOne(
            { _id: userId },
            { $set: updateData }
        );
        
        // modifiedCount tells us how many documents were actually updated
        console.log(`Updated ${result.modifiedCount} document(s)`);
        return result;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

// DELETE - Remove a document
async function deleteUser(client, userId) {
    try {
        const database = client.db(dbName);
        const users = database.collection("users");
        
        // deleteOne removes the first document that matches the filter
        // If you want to delete multiple documents, use deleteMany()
        const result = await users.deleteOne({ _id: userId });
        
        // deletedCount tells us how many documents were removed
        console.log(`Deleted ${result.deletedCount} document(s)`);
        return result;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

// ================= EXPRESS ROUTES =================
// Each route demonstrates how to use the CRUD operations
// through HTTP endpoints

// CREATE - POST /users
app.post('/users', async (req, res) => {
    // Connect to MongoDB for this request
    const client = await connectToMongo();
    try {
        // Create user with data from request body
        const result = await createUser(client, req.body);
        res.json(result);
    } catch (error) {
        // If there's an error, return 500 status code and error message
        res.status(500).json({ error: error.message });
    } finally {
        // Always close the connection when done
        // This is important to prevent memory leaks
        await client.close();
    }
});

// READ - GET /users
app.get('/users', async (req, res) => {
    const client = await connectToMongo();
    try {
        const users = await findUsers(client);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
});

// UPDATE - PUT /users/:id
app.put('/users/:id', async (req, res) => {
    const client = await connectToMongo();
    try {
        // Update user with ID from URL parameters and data from request body
        const result = await updateUser(client, req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
});

// DELETE - DELETE /users/:id
app.delete('/users/:id', async (req, res) => {
    const client = await connectToMongo();
    try {
        const result = await deleteUser(client, req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
});

// Start the Express server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// ================= EXAMPLE USAGE =================
/*
// This is how you would use these functions in a script
async function main() {
    // Connect to MongoDB
    const client = await connectToMongo();
    try {
        // Example user data
        const userData = {
            name: "John Doe",
            email: "john@example.com",
            age: 30
        };
        
        // Create a new user
        const createResult = await createUser(client, userData);
        console.log("Created user:", createResult);
        
        // Find all users
        const users = await findUsers(client);
        console.log("All users:", users);
        
        // Update the user we just created
        // Note: You'll need to use the actual _id from createResult
        await updateUser(client, createResult.insertedId, { age: 31 });
        
        // Delete the user
        await deleteUser(client, createResult.insertedId);
    } finally {
        // Always close the connection when done
        await client.close();
    }
}

// To run the example:
// main().catch(console.error);
*/