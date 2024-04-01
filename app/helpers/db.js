import { connect, connection, disconnect } from "mongoose";
const uri = process.env.NEXT_PUBLIC_MONGO_SRV;
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await connect(uri, clientOptions);
    await connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await disconnect();
  }
}
run().catch(console.dir);
