// /api/new-meetup - if a request is sent to this url then the function here runs
import { MongoClient } from "mongodb";

async function handler(request, response) {
  if (request.method === "POST") {
    const data = request.body;

    const client = await MongoClient.connect(
      "mongodb+srv://idiris_omer:12Deadmetal12@cluster0.7pdpnm4.mongodb.net/test"
    );
    const db = client.db();

    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne(data);
    console.log(result);
    client.close();

    response
      .status(201)
      .json({ message: "meetup has been added to the database successfuly" });
  }
}

export default handler;
