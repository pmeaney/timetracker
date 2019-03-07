const multer = require('multer');
const path = require('path');
// const dotenv = require("dotenv").config({ path: '../.env' });

const Api_fns = require('../lib/api_fns')

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!  This is just some configuration code
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Todo: to make a config for pdf and .doc/.docx files
//MULTER CONFIG: to get file photos to temp server storage

// TODO: Change the file name if it already exists
// For Reference: https://stackoverflow.com/questions/36648395/upload-a-file-in-nodejs-with-multer-and-change-name-if-the-file-already-exists
const multerConfig_images = {

  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function (req, file, next) {
      next(null, './src/server/public/profilePhoto-storage');
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
      logFilenameToDB_multerFile(fileName_saved, 'profile_photo')
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
      console.log('inside multer storage -> destination function')
      next(null, './src/server/public/resume-storage');
    },

    //Then give the file a unique name
    filename: function (req, file, next) {
      // can view file info: console.log(file);
      // including this: file.fieldname

      console.log('inside multer storage -> filename function')

      console.log('file.mimetype is ', file.mimetype);
      const fileType_extension = file.mimetype.split('/')[1];

      const fileName_prefix = 'Resume_user_id__' + req.session.user_id;
      console.log('fileType_extension is', fileType_extension)
      if (fileType_extension === 'vnd.openxmlformats-officedocument.wordprocessingml.document'){
        const fileName_saved = fileName_prefix + '.docx'
        console.log('fileName_saved is', fileName_saved)
        logFilenameToDB_multerFile(fileName_saved, 'profile_resume')
        next(null, fileName_saved);
      } else {
        const fileName_saved = fileName_prefix + '.' + fileType_extension
        console.log('fileName_saved is', fileName_saved)
        logFilenameToDB_multerFile(fileName_saved, 'profile_resume')
        next(null, fileName_saved);
      }
      
    }
  }),
  //A means of ensuring only images are uploaded. 
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }

    const fileMimetype = file.mimetype;
    console.log('mimetype is', fileMimetype)
    const acceptableMimetypeArray = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    if (fileMimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { 
      console.log('photo uploaded');
      next(null, true);
    }
    else if (acceptableMimetypeArray.includes(fileMimetype)) {
      console.log('photo uploaded');
      next(null, true);
    } else {
      console.log("file not supported"); // need to report this as an error to the user
      // save message to session:
      req.session.msg_bad_doc_mimetype = 'Sorry, only .pdf, .doc, and .docx filetypes are supported'
      // req.flash('infoMessage', 'Sorry, a user with that email address already exists.  You may already have an account, or perhaps you mistyped your email address.')  
      req.flash('infoMessage', req.session.msg_bad_doc_mimetype)  
      return next();
    }
  },
  // limits: { fileSize: 1000000, files: 1 },
};

  
const uploadedPhotoConfig = multer(multerConfig_images).single('fileName_input');
const uploadedResumeConfig = multer(multerConfig_docs).single('fileName_input');

var logFilenameToDB_multerFile = (new_filename, photoOrResume_str) => {
  return Promise.try(() => {
    // note: we update the filename, because the filename is initialized in the DB call to create new user during registration
    // note: photoOrResume_str will be 'profile_photo' or 'profile_resume'
    return Api_fns.update_FileName_ProfilePhoto_byUserID(new_filename, req.session.user_id, photoOrResume_str)
  })
}

const post_test_post = function (req, res, next) {
  console.log('post_test_post: req is', req)
}
// ****************************************************
// ***   Post: Profile photo upload
// ****************************************************
const post_profilePhotoUpload = function (req, res, next) {

  // uploadedPhotoConfig(req, res, function(err) {
  //   console.log('running uploadedPhotoConfig')

  //   if (err instanceof multer.MulterError) {
  //     // A Multer error occurred when uploading.
  //     console.log('err MulterError: ', err)
  //   } else if (err) {
  //     console.log('other error during multer upload attempt', err)
  //     // An unknown error occurred when uploading.
  //   }
  // })
  
  // Next, upload the filename
  // return Promise.try(() => {
  //     return uploadProfilePhoto_filename(req.file.filename);
  // })
  //   .then((result) => { console.log('result from uploadProfilePhoto_filename is:', result)})

  // .then(()=>{

  // if (req.session.user_id) {
  //   // res.redirect('/users/profile/' + req.session.user_id)
  //   // ? This might actually need to be /user/ instead of /dashboard/user/
  //   res.redirect('/dashboard/user/' + req.session.user_id)
  // } else {
  //   // if they try this without being logged in:
  //   res.redirect('/inaccessible')

  // }
  // })
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
  post_test_post,
  uploadedPhotoConfig,
  uploadedResumeConfig,
  post_profilePhotoUpload,
  post_profileResumeUpload
}