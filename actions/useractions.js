"use server"
// this use server line is important to use mongodb in client components
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Delta from "quill-delta";


export const getallDocuments = async (creatorname) => {
  const client = await clientPromise;
  const db = client.db("collaborativeEditor")
  const documentsCollection = db.collection("documents")

  const documentsarr = await documentsCollection.find({ creator: creatorname }).sort({ updatedAt: -1 }).toArray();

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

export const CreateNewDocument = async (docDetails, templateContent) => {
  const client = await clientPromise;
  const db = client.db("collaborativeEditor")
  const documentsCollection = db.collection("documents")

  if (templateContent) {
    // when we insert document, it returns is of inserted document
   const returnID = await documentsCollection.insertOne({
      docname: docDetails.title,
      description: docDetails.description,
      category: docDetails.category,
      content: templateContent,
      creator: docDetails.sessionName,
      creatoremail: docDetails.sessionEmail,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return returnID.insertedId.toString();
  } else {
   const returnID = await documentsCollection.insertOne({
      docname: docDetails.title,
      description: docDetails.description,
      category: docDetails.category,
      content: new Delta(), // Start with an empty Delta
      creator: docDetails.sessionName,
      creatoremail: docDetails.sessionEmail,
      createdAt: new Date(),
      updatedAt: new Date()
    });
   
    return returnID.insertedId.toString();
  }


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

export const getTemplatesByCategory = async (categoryKey) => {
  const client = await clientPromise;
  const db = client.db("collaborativeEditor")
  const documentsCollection = db.collection("templates")

  const documentsarr = await documentsCollection.find({ category: categoryKey }).toArray();

  const transformedArr = documentsarr.map(currdoc => ({
    ...currdoc,
    _id: currdoc._id.toString(), // Convert ObjectId to plain string
  }));

  return transformedArr;
}

export const getTemplateObject = async (keyID) => {

  const client = await clientPromise;
  const db = client.db("collaborativeEditor")
  const documentsCollection = db.collection("templates")

  // if not exist it returns null
  const templateobj = await documentsCollection.findOne({ id: keyID })
  if (templateobj) {
    const result = {
      ...templateobj,
      _id: templateobj._id.toString(), // Convert ObjectId to plain string
    };
    return result;
  }
  return null;
}


export const getSearchData = async (searchTerm, sessionEmail, usedFor) => {

  const client = await clientPromise;
  const db = client.db("collaborativeEditor");

  if (usedFor == 'collabeditor' && sessionEmail) {
    const documentsCollection = db.collection("documents");

    const results = await documentsCollection.find({
      docname: { $regex: searchTerm, $options: 'i' }, // partial match, case-insensitive
      creatoremail: sessionEmail // filter by user
    }).toArray();

    const transformedArr = results.map(currdoc => ({
      ...currdoc,
      _id: currdoc._id.toString(), // Convert ObjectId to plain string
    }));

    return transformedArr;
  }

  if (usedFor == 'templates') {
    const templatesCollection = db.collection("templates");

    const results = await templatesCollection.find({
      title: { $regex: searchTerm, $options: 'i' } // partial match, case-insensitive
    }).toArray();
    const transformedArr = results.map(currdoc => ({
      ...currdoc,
      _id: currdoc._id.toString(), // Convert ObjectId to plain string
    }));

    return transformedArr;
  }


}
