/*
will handle the uploaded pdf files + save info to database 
*/

const Document = require('../models/Document');
const path = require('path');

//new upload
const addDocument = async (req, res) => {
  try {
    //check upload
    if (!req.file) {
      return res.status(400).json({ message: 'Missing or incorrect file. Please upload a PDF!' });
    }

    // get data from request
    const { project_id, user_id } = req.body;

    //get details from multer
    const file_name = req.file.originalname;  // og file name
    const file_path = path.join('uploads', req.file.filename);  // path of saved file

    // new record in db
    const newDocument = await Document.create({
      project_id,
      user_id,
      file_name,
      file_path,
    });

    // get document details
    res.status(201).json({
      message: 'Document uploaded successfully',
      document: newDocument,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading document', error: error.message });
  }
};

//get all
const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving documents', error });
  }
};

module.exports = {
  addDocument,
  getAllDocuments,
};
