const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath += 'videos/';
    } else if (file.mimetype === 'application/pdf') {
      uploadPath += 'documents/';
    } else {
      uploadPath += 'others/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/': ['jpeg', 'jpg', 'png', 'gif', 'webp'],
    'video/': ['mp4', 'webm', 'mov'],
    'application/pdf': ['pdf'],
    'application/': ['msword', 'vnd.openxmlformats-officedocument.wordprocessingml.document']
  };
  
  const fileType = file.mimetype;
  let isAllowed = false;
  
  for (const [prefix, extensions] of Object.entries(allowedTypes)) {
    if (fileType.startsWith(prefix)) {
      isAllowed = true;
      break;
    }
  }
  
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB
  files: 10
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
