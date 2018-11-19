const multer = require('multer');
// const dotenv = require("dotenv").config({ path: '../.env' });


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!  This is just some configuration code
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Todo: to make a config for pdf and .doc/.docx files
//MULTER CONFIG: to get file photos to temp server storage
const multerConfig_images = {

  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function (req, file, next) {
      next(null, './public/profilePhoto-storage');
    },

    //Then give the file a unique name
    filename: function (req, file, next) {
      // can view file info: console.log(file);
      // including this: file.fieldname

      console.log('file.mimetype is ', file.mimetype);
      const fileType_extension = file.mimetype.split('/')[1];

      const fileName_prefix = 'profilePhoto_user_id__' + req.session.user_id;
      const fileName_saved = fileName_prefix + '.' + fileType_extension;
      console.log('fileName_saved is', fileName_saved);
      next(null, fileName_saved);
    }
  }),
  //A means of ensuring only images are uploaded. 
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if (image) {
      console.log('photo uploaded');
      next(null, true);
    } else {
      req.session.msg_bad_image_mimetype = 'Sorry, that file type is not supported for image uploads.'
      //TODO:  A better message response to user on failure.
      return next();
    }
  },
  // limits: { fileSize: 1000000, files: 1 },
};

const multerConfig_docs = {

  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function (req, file, next) {
      next(null, './public/resume-storage');
    },

    //Then give the file a unique name
    filename: function (req, file, next) {
      // can view file info: console.log(file);
      // including this: file.fieldname

      console.log('file.mimetype is ', file.mimetype);
      const fileType_extension = file.mimetype.split('/')[1];

      const fileName_prefix = 'profilePhoto_user_id__' + req.session.user_id;
      const fileName_saved = fileName_prefix + '.' + fileType_extension;
      console.log('fileName_saved is', fileName_saved);
      next(null, fileName_saved);
    }
  }),
  //A means of ensuring only images are uploaded. 
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }

    const fileMimetype = file.mimetype;
    const acceptableMimetypeArray = ['application/pdf', 'application/msword', ' application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    if (acceptableMimetypeArray.includes(fileMimetype)) {
      console.log('photo uploaded');
      next(null, true);
    } else {
      console.log("file not supported"); // need to report this as an error to the user
      // TODO: redirect with flash
      // save message to session:
      req.session.msg_bad_doc_mimetype = 'Sorry, only .pdf, .doc, and .docx filetypes are supported'
      // req.flash('infoMessage', 'Sorry, a user with that email address already exists.  You may already have an account, or perhaps you mistyped your email address.')  
      return next();
    }
  },
  // limits: { fileSize: 1000000, files: 1 },
};

const uploadedPhotoConfig = multer(multerConfig_images).single('_profilePhoto');
const uploadedResumeConfig = multer(multerConfig_docs).single('_profileResume');

// ****************************************************
// ***   Post: Profile photo upload
// ****************************************************
const post_profilePhotoUpload = function (req, res, next) {

  // return Promise.try(() => {
  //     return uploadProfilePhoto_filename(request.file.filename);
  // }).then(()=>{

  if (req.session.user_id) {
    // res.redirect('/users/profile/' + req.session.user_id)
    // ? This might actually need to be /user/ instead of /dashboard/user/
    res.redirect('/dashboard/user/' + req.session.user_id)
  } else {
    // if they try this without being logged in:
    res.redirect('/inaccessible')

  }
  // })

}

// ****************************************************
// ***   Post: Resume file upload
// ****************************************************
const post_profileResumeUpload = function (req, res, next) {

  // return Promise.try(() => {
  //     return uploadProfilePhoto_filename(request.file.filename);
  // }).then(()=>{

  if (req.session.user_id) {
    // res.redirect('/users/profile/' + req.session.user_id)
    // ? This might actually need to be /user/ instead of /dashboard/user/
    res.redirect('/dashboard/user/' + req.session.user_id)
  } else {
    // if they try this without being logged in:
    res.redirect('/inaccessible')
  }
  // })

}


module.exports = {
  uploadedPhotoConfig,
  uploadedResumeConfig,
  post_profilePhotoUpload,
  post_profileResumeUpload
}