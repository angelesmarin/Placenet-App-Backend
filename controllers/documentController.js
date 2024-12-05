const { Document, Project, Property } = require('../models');
const s3 = require('../aws/s3');
const generatePresignUrl = require('../aws/generatePresignUrl');
require('dotenv').config();

//will handle uploading pdf files + save info to db 


const addDocument = async (req, res) => {
  try {
    //ensure upload
    if (!req.file) {
      return res.status(400).json({ message: 'Missing or incorrect file type. Please upload a PDF' });
    }
    const user_id = req.user.userId; //get userid from jwt payload 
    const { project_id } = req.body; //get proj id from request body 

    const project = await Project.findOne({
      where: {
        project_id,
        user_id,
      },
    });

    if (!project) {
      console.log('Authorization failed: User does not own the project');
      return res.status(403).json({message: 'not authorized to upload documents to project'});
    }
    //get details from multer
    const file_name = req.file.originalname;  // og file name
    const file_path = req.file.location//s3 url

    //new record in db
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

//get all docs for user 
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

//delete from s3 & db
const deleteDocument = async (req, res) => {
  try {
    const user_id = req.user.userId; //get id from payload 
    const { document_id } = req.params; //get doc id from parameters 

    //find in db
    const document = await Document.findOne({
      where: { document_id, user_id },
      include: {
        model: Project,
        include: {
          model: Property,
          where: { user_id },
        },
      },
    });

    //check auth 
    if (!document) {
      return res.status(404).json({ message: 'Document not found or not authorized to delete' });
    }
    
    const fileKey = document.file_path.split('amazonaws.com/')[1]; //get s3 key from url

    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    }).promise();

    //delete from db
    await Document.destroy({ where: { document_id } });

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Error deleting document', error: error.message });
  }
};

//download doc from s3 
const downloadDocument = async (req, res) => {
  const { document_id } = req.params;  //from url
  try {
    //find in db
    const document = await Document.findOne({ where: { document_id } });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const fileKey = document.file_path.split('amazonaws.com/')[1];  //get from S3 url
    const presignedUrl = await generatePresignUrl(process.env.AWS_BUCKET_NAME, fileKey);

    //return url to app
    res.status(200).json({ url: presignedUrl });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ message: 'Error generating presigned URL', error: error.message });
  }
};
    

module.exports = {
  addDocument,
  getAllDocuments,
  deleteDocument,
  downloadDocument,
};
