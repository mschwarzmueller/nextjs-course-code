import { MongoClient } from 'mongodb';

// /api/new
// POST /api/new

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body; //data of incoming request 

    const {title, image, address, description}= data;//fields on the request body

    //never run on client side
    //secure
    const client = await MongoClient.connect ('mongodb+srv://donia:donia2022@cluster0.r15cg.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();

    const meetupsCollection = db.collection('meetups');
    const result = await meetupsCollection.insertOne(data);
    console.log(result);
    client.close();
    res.status(201).json({message: 'Meetup inserted!'});
}
    /*const client = await MongoClient.connect(
      'mongodb+srv://maximilian:TU6WdZF2EjFWsqUt@cluster0.ntrwp.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: 'Meetup inserted!' });
  */
  }


export default handler;
