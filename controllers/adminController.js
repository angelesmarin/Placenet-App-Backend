// const { User, Property, Project, Document } = require('../models');


// //NEW: admin panel: a single user's complete profile
// //use later 

// async function getAdmin(userId) {
//     try {
//       //get user + associated items
//       const user = await User.findOne({
//         where: { user_id: userId },
//         include: {
//           model: Property,
//           include: {
//             model: Project,
//             include: {
//               model: Document,
//               //for the following, specify what fields to get: 
//               attributes: ['document_id', 'file_name', 'file_path', 'created_at'], // here 
//             },
//             attributes: ['project_id', 'name', 'start_date', 'created_at'], // here
//           },
//           attributes: ['property_id', 'name', 'created_at'], // here 
//         },
//         attributes: ['user_id', 'username'],
//       });
  
//       if (!user) {
//         throw new Error('User not found');
//       }
  
//       return user; //return user + items 
//     } catch (error) {
//       console.error('Error fetching user profile summary:', error);
//       throw new Error(`Error fetching user profile summary: ${error.message}`);
//     }
//   }
  
//   module.exports = {
//     getAdmin,
//   };
  