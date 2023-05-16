const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');

dotenv.config()
const port = process.env.PORT || 5000;

// middleware 

app.use(cors());
app.use(express.json());



app.get('/', (req, res)=>{
    res.send('Ema jhon server is running ')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6otengp.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




async function run() {
  try {
    

    const productCollection = client.db('emaJhonDB').collection('products');

    app.get('/products', async(req,res)=>{
        console.log(req.query);
        const page = parseInt(req.query.page) || 0 ;
        const limit = parseInt(req.query.limit) || 10 ;
        const skip  = page * limit;
        const result = await productCollection.find().skip(skip).limit(limit).toArray();
        res.send(result)
    })


    app.get('/totalProducts', async(req,res)=>{
        const totalProducts = await productCollection.estimatedDocumentCount();
        res.send({totalProducts})
    })

    app.post('/productsByIds', async(req,res)=>{
      const ids = req.body;
      const objectIds = ids.map(id => new ObjectId(id))
      const query = {_id:  {$in: objectIds}}

      const result = await productCollection.find(query).toArray();
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);



app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})