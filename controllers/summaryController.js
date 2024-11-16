const { User, Property, Project, Document } = require('../models');

//NEW: user profile summary controller

const getProfileSummary = async (req, res) => {
    console.log("Profile summary route reached");
    const userId = req.params.userId;
    try { 
    //const { userId } = req.params;
    //user profile summary + 
    const user = await User.findOne({
      where: { user_id: userId },
      include: {
        model: Property,
        include: {
          model: Project,
          include: {
            model: Document,
            attributes: ['document_id', 'file_name', 'file_path', 'created_at'],  //here
          },
          attributes: ['project_id', 'name', 'start_date', 'created_at'], //here
        },
        attributes: ['property_id', 'name', 'created_at'], //here
      },
      attributes: ['user_id', 'username'], //here
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile summary:', error);
    res.status(500).json({ message: 'Error fetching profile summary', error });
  }
};
  
  module.exports = {
    getProfileSummary,
  };
  