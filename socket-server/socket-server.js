// Import required modules

require('dotenv').config(); // This reads the .env file
const { ObjectId } = require('mongodb');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const Delta = require('quill-delta');
const cors = require('cors'); // Important for connecting from Next.js

const { MongoClient } = require('mongodb'); // Import MongoClient directly

//  Get the MongoDB URI from the environment
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('ERROR: Please set the MONGODB_URI in your .env file');
  process.exit(1); // Stop the server if no URI is found
}

//  Create a MongoDB client promise directly here
const client = new MongoClient(uri);
const clientPromise = client.connect();

// Initialize express app and http server
const app = express();
const httpServer = createServer(app);


// Configure CORS to allow requests from your Next.js frontend
// This is crucial to avoid connection errors
app.use(cors({
  origin: process.env.FRONTEND_URL, // Your Next.js app URL
  methods: ["GET", "POST"]
}));

// Initialize Socket.io and attach it to the http server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Add basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Socket server is running' });
});

//  DEFINE CLEANUP FUNCTION 
const startCleanupInterval = async () => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("collaborativeEditor");
    const chatCollection = db.collection("chat_messages");

    setInterval(async () => {
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const result = await chatCollection.deleteMany({
          timestamp: { $lt: sevenDaysAgo }
        });

        console.log(`Cleaned up ${result.deletedCount} messages older than 7 days`);
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    }, 24 * 60 * 60 * 1000);

  } catch (error) {
    console.error('Could not start cleanup interval:', error);
  }
};


// Handle socket connections
io.on('connection', async (socket) => {

  const client = await clientPromise;
  const db = client.db("collaborativeEditor")
  const documentsCollection = db.collection("documents")
  const chatCollection = db.collection("chat_messages");

  console.log('User connected:', socket.id);
  // here documentId is mongodb ID
  // 1. Handle joining a room (a specific document)
  socket.on('join-document', async (documentId, sessionname, sessionemail) => {

    socket.join(documentId);
    console.log(`User ${socket.id} joined document ${documentId}`);

    // getting chat history for new user
    const chatHistory = await chatCollection
      .find({ documentId: documentId })
      .sort({ timestamp: -1 }) // Newest first
      .limit(10)
      .toArray();

    // Send history to  user
    if (chatHistory) {
      socket.emit('load-chat-history', chatHistory.reverse());
    }

    // getting editor data for new user
   
    let document = await documentsCollection.findOne( { _id: new ObjectId(documentId) });

    if (document && document.creatoremail != sessionemail) {
      // means he is collaborator
      await documentsCollection.updateOne(
         { _id: new ObjectId(documentId) },
        { $addToSet: { collaborators : sessionname } }
      );
      console.log('collaborator added');      
    }

    // you should handle when user type anything randam after slash(no valid document)
    if (!document) {
      return;
    }

    // Send the current document content from MongoDB to the user who just joined
    socket.emit('load-document', document.content); // Send the content field
    console.log("Loaded document from DB:", document.content);

    // Broadcast to others in the room that a user joined , runs when 2nd user joined
    socket.to(documentId).emit('user-joined', socket.id); // use it to show notification in room
  });

  // 2. Handle text changes and broadcast to others in the same room
  socket.on('send-changes', (delta, documentId) => {
    // Broadcast the change to all other users in the room
    socket.to(documentId).emit('receive-changes', delta);
  });

  //   3. save the changes to mongodb
  socket.on('save-document', async (content, documentId) => {
    await documentsCollection.updateOne(
       { _id: new ObjectId(documentId) }, // Filter: Find document with this ID
      {
        $set: {
          content: content,
          updatedAt: new Date() // Good practice to track when document was updated
        }
      }
    );
    console.log("Document saved to DB for documentId:", documentId);
  });

  // 4. Handle live chat messages
  socket.on('send-chat-message', async (data) => {
    // data should contain: { message: string, documentId: string, user: string }
    console.log(`Chat message from ${data.user} in ${data.documentId}: ${data.message}`);

    // save message data to our database
    const messageDocument = {
      documentId: data.documentId,
      user: data.user,
      image: data.image,
      message: data.message,
      timestamp: new Date()
    };

    await chatCollection.insertOne(messageDocument);

    // broadcast to everyone in the room
    io.to(data.documentId).emit('receive-chat-message', messageDocument);
  });

  // 5. Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // You could broadcast a 'user-left' event here
  });
});

// Start the socket server on port 3001
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket server running on http://localhost:${PORT}`);
  startCleanupInterval();
});