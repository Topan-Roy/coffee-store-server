const express = require('express')
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT ||3000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a6tztk3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
      const coffeeCollection = client.db("coffeedb").collection("coffees")
      const userCollection = client.db("coffeedb").collection("users")
   

    app.get('/coffees',async(req,res)=>{
      //  const cursor = coffeeCollection.find()
      //  const result= await cursor.toArray();
      const result=await coffeeCollection.find().toArray();
      res.send(result)
    })
    app.get('/coffees/:id',async(req,res)=>{
       const id= req.params.id;
        const query = {_id: new ObjectId(id) };
    const result = await coffeeCollection.findOne(query);
    res.send(result)
    })

  app.post('/coffees',async(req,res)=>{
    const newcoffee=req.body;
    console.log(newcoffee)
    const result = await coffeeCollection.insertOne(newcoffee);
    res.send(result)
  })


  app.put('/coffees/:id',async(req,res)=>{
     const id= req.params.id;
     const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatecoffee= req.body;
        const updateDoc = {
      $set:  updatecoffee
    };
    //      const updateDoc = {
    //   $set: {
    //    name:updatecoffee.name,
    // 
    //   },
    // };

       const result = await coffeeCollection.updateOne(filter, updateDoc, options);
       res.send(result)
  })


  app.delete('/coffees/:id',async(req,res)=>{
    const id= req.params.id;
     const query = {_id: new ObjectId(id) };
    const result = await coffeeCollection.deleteOne(query);
    res.send(result)
  })

    // user  related APIS
  app.get('/users',async(req,res)=>{
      //  const cursor = coffeeCollection.find()
      //  const result= await cursor.toArray();
      const result=await userCollection.find().toArray();
      res.send(result)
    })

  app.post('/users',async(req,res)=>{
    const userProfile= req.body;
    console.log(userProfile)
     const result = await userCollection.insertOne(userProfile);
     res.send(result)
  })
app.patch('/users',async(req,res)=>{
  const{email,lastSignInTime}=(req.body);
  const filter={email:email};
  const updateDoc = {
      $set: {
       lastSignInTime:lastSignInTime
      },
    };
        const result = await userCollection.updateOne(filter, updateDoc);
         res.send(result)
})

  app.delete('/users/:id',async(req,res)=>{
    const id= req.params.id;
     const query = {_id: new ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    res.send(result)
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('coffee server is geting hoter')
})

app.listen(port, () => {
  console.log(`coffee server is running on the port ${port}`)
})