import { MongoClient } from 'mongodb';

async function handler(req, res) {
  try {
    const client = await MongoClient.connect(
      'mongodb+srv://jerry:cloudmongo5299@cluster0.bmczp.mongodb.net/Testing_First_NextJS?retryWrites=true&w=majority'
    );
    const db = client.db();
    const meetUpsCollection = db.collection('first_nextjs_meetups');

    if (req.method === 'POST') {
      const data = req.body;
      // const { title, image, address, description } = data;
      const result = await meetUpsCollection.insertOne(data);
      console.log(result);
      client.close();
      res.status(201).json({ message: 'added ew meetup' });
    }
  } catch (e) {
    console.log('here');
    console.log(e.message);
  }
}
export default handler;
