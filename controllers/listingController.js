const { User, Property, Project, Document } = require('../models');
i = 0;

const getListingSummaries = async (req, res) => {

    try { 
    const user = await User.findAll({
        include: {
            model: Property,
            include: {
                model: Project,
                include: {
                    model: Document,
                    attributes: ['document_id', 'file_name', 'file_path', 'created_at'],
                },
                attributes: ['project_id', 'name', 'completion_date', 'created_at'],
            },
            attributes: ['property_id', 'name', 'created_at'],
        },
        attributes: ['user_id', 'username'],
    });
    res.status(200).json(user);
    } catch (error) {
    console.error('Error fetching profile summary:', error);
    res.status(500).json({ message: 'Error fetching profile summary', error: error.message });
}
};

module.exports = {
    getListingSummaries,
    };