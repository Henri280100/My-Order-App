import { v2 as cloudinary } from 'cloudinary';
import { ReadStream } from 'fs';
import { UploadResult } from './response.utils';

export const uploadStream = (
	fileStream: ReadStream,
	name: string
): Promise<UploadResult> => {
	return new Promise<UploadResult>((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{ public_id: name },
				(error: any, result: UploadResult) => {
					if (error) {
						reject(error);
					} else {
						resolve(result);
					}
				}
			)
			.end(fileStream);
	});
};
