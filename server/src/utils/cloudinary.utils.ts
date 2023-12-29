import {
	DeleteApiResponse,
	UploadApiResponse,
	v2 as cloudinary,
} from 'cloudinary';
import * as dotenv from 'dotenv';
import streamifier from 'streamifier';

dotenv.config({ path: __dirname + '/.env' });

cloudinary.config({
	cloud_name: 'didyifgtm',
	api_key: '184652387491793',
	api_secret: '9Il5OK75WHhAc440DQwvf2HSk0M',
});

export const uploadToCloudinary = (file: Express.Multer.File) => {
	return new Promise<UploadApiResponse>((resolve, reject) => {
		let stream = cloudinary.uploader.upload_stream(
			{ folder: 'store_img' },

			(error: any, result: any) => {
				if (result) {
					resolve(result);
				} else {
					reject(error);
				}
			}
		);

		streamifier.createReadStream(file.buffer).pipe(stream);
	});
};

export const deleteImage = (id: string) => {
	return new Promise<DeleteApiResponse>((resolve, reject) => {
		return cloudinary.uploader.destroy(id, (error: any, result: any) => {
			if (result) {
				resolve(result);
			} else {
				reject(error);
			}
		});
	});
};

export const getResized = (imageName: string) => {
	return cloudinary.url(imageName, {
		width: 540,
		height: 405,
		crop: 'fill',
		quality: 'auto',
	});
};
