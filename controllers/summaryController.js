const { User, Property, Project, Document } = require('../models');

//NEW: user profile summary controller

const getProfileSummary = async (req, res) => {
    const userId = req.user.userId; //from payload
    try { 
    const user = await User.findOne({
      where: { user_id: userId },
      include: {
        model: Property,
        include: {
            model: Project,
            include: {
                model: Document,
                attributes: ['document_id', 'file_name', 'file_path', 'created_at'],
            },
            attributes: ['project_id', 'name', 'start_date', 'created_at'],
        },
        attributes: ['property_id', 'name', 'created_at'],
    },
    attributes: ['user_id', 'username'],
});
if (!user) {
    return res.status(404).json({ message: 'User not found or unauthorized' });
}
res.status(200).json(user);
} catch (error) {
console.error('Error fetching profile summary:', error);
res.status(500).json({ message: 'Error fetching profile summary', error: error.message });
}
};
  
  module.exports = {
    getProfileSummary,
  };
  