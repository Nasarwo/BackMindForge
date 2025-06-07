import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
	async uploadImage(file: Express.Multer.File): Promise<string> {
		const uploadDir = path.join(__dirname, '..', '..', 'uploads');

		try {
			await fs.access(uploadDir);
		} catch {
			await fs.mkdir(uploadDir, { recursive: true });
		}

		const fileName = `${Date.now()}-${file.originalname}`;
		const filePath = path.join(uploadDir, fileName);

		await fs.writeFile(filePath, file.buffer);

		return fileName;
	}
}
