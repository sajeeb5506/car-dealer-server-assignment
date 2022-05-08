const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const port = process.env.PORT||5000;
require('dotenv').config();

//middlewear
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.CAR_DEALER}:${process.env.CAR_PASS}@cluster0.4qb7o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){

    try{

        await client.connect();
        const carItems = client.db('cardealer').collection('carItems');

        //get api 
        app.get('/cars', async(req,res)=>{
            const query = {};
            const cursor = carItems.find(query);
            const caritems = await cursor.toArray();
            res.send(caritems);

        });

        // post api
          app.post('/cars',async(req,res)=>{
              const data= req.body;
              const result= await carItems.insertOne(data);
              res.send(result);
          })

       // find user items api
        app.get('/myitems', async(req,res)=>{
        const email = req.query.email;
    
        const query={email};
        const cursor = carItems.find(query);
        const caritems = await cursor.toArray();
        res.send(caritems);

         });
        // delete api 
         app.delete('/cars/:id', async(req,res)=>{
             const id= req.params.id;
             const query = {_id:ObjectId(id)};
             const result = await carItems.deleteOne(query);
             res.send(result);
         })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{

    res.send('hello.');

})


app.listen(port,()=>{
    console.log('server ready', port)
})