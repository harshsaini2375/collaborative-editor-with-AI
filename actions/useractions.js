"use server"
// this use server line is important to use mongodb in client components
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Delta from "quill-delta";


export const getallDocuments = async (creatorname) => {
    const client = await clientPromise;
    const db = client.db("collaborativeEditor")
    const documentsCollection = db.collection("documents")

    const documentsarr = await documentsCollection.find({ creator: creatorname }).toArray();

    const transformedArr = documentsarr.map(currdoc => ({
    ...currdoc,
    _id: currdoc._id.toString(), // Convert ObjectId to plain string
  }));

    return transformedArr;
}

export const deleteSelectedDoc = async (deleteID) => {
    const client = await clientPromise;
    const db = client.db("collaborativeEditor")
    const documentsCollection = db.collection("documents")

    documentsCollection.deleteOne({ _id: new ObjectId(deleteID) });

}

export const CreateNewDocument = async (docDetails) => {
  const client = await clientPromise;
  const db = client.db("collaborativeEditor")
  const documentsCollection = db.collection("documents")

  await documentsCollection.insertOne({
        docname: docDetails.title,
        description: docDetails.description,
        category: docDetails.category,
        content: new Delta(), // Start with an empty Delta
        creator: docDetails.sessionName,
        creatoremail: docDetails.sessionEmail,
        createdAt: new Date(),
        updatedAt: new Date()
      });
}

export const getDocumentWithID = async (keyID) => {

   // Validate input first
  if (!keyID || typeof keyID !== 'string' || keyID.length !== 24 || !keyID.match(/^[0-9a-fA-F]{24}$/)) {
    return null; // Invalid ID format
  }

  const client = await clientPromise;
  const db = client.db("collaborativeEditor")
  const documentsCollection = db.collection("documents")

  // if not exist it returns null
  const docobj = await documentsCollection.findOne({ _id: new ObjectId(keyID) })
   const result = {
    ...docobj,
    _id: docobj._id.toString(), // Convert ObjectId to plain string
  };
  return result;
}