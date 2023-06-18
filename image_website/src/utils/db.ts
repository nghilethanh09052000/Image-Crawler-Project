const { MongoClient, ServerApiVersion } = require('mongodb');


const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectMongoDb() {
  try 
  {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = await client.db("images")
    
    console.log('Connect MongoDB successfully')
    return db

  } 
  catch(error) 
  {
    // Ensures that the client will close when you finish/error
    console.log('Failed to connect', error)
    await client.close();
  }
}
