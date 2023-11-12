import multer from 'multer';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		const filename = file.originalname
			? `${Date.now()}-${file.originalname}`
			: '';
		cb(null, filename);
	},
});

// Check file type
const checkFileType = (file: Express.Multer.File, cb: any) => {
	// Allowed filetypes
	const filetypes = /jpeg|jpg|png|gif/;

	// Check extension
	const extname = file.originalname
		? file.originalname.toLowerCase().split('.').pop()
		: undefined;

	// Check mimetype
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		return cb(new Error('Invalid file type'));
	}
};

const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 },
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	},
});

export default upload;
