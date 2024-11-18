const { Document, Project, Property } = require('../models');
const path = require('path');
/*
will handle the uploaded pdf files + save info to database 
*/

//new
const addDocument = async (req, res) => {
  try {
    //check upload
    if (!req.file) {
      return res.status(400).json({ message: 'Missing or incorrect file type. Please upload a PDF!' });
    }
    const user_id = req.user.userId; //get userid from jwt payload 
    const { project_id } = req.body; //get proj id from request body 

    const project = await Project.findOne({
      where: { project_id },
      include: {
        model: Property,
        where: { user_id },
      },
    });

    if (!project) {
      return res.status(403).json({message: 'not authorized to upload documents to project'});
    }
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
    res.status(201).json({
      message: 'Document uploaded successfully',
      document: newDocument,
    });
  } catch (error) {
    console.error('error uploading doc:', error);
    res.status(500).json({ message: 'Error uploading document', error: error.message });
  }
};

//get all
const getAllDocuments = async (req, res) => {
  try {
    const user_id = req.user.userId; //from payload 
    const documents = await Document.findAll({
      where: { user_id },
      include: {
        model: Project,
        include: {
          model:Property,
          where: { user_id },
        },
      },
    });
    res.status(200).json(documents);
  } catch (error) {
    console.error('error getting documents:', error);
    res.status(500).json({ message: 'Error retrieving documents', error });
  }
};

module.exports = {
  addDocument,
  getAllDocuments,
};
