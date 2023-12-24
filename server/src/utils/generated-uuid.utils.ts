import { v4 as uuid } from 'uuid';

// Generate a UUID
export function generateUUID(): string {
	return uuid();
}

// Check if a string is a valid UUID
export function isValidUUID(str: string) {
	const regex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
	return regex.test(str);
}

// Generate a random string with specified length
export function generateRandomString(length: any) {
	const chars =
		'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let str = '';
	for (let i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	return str;
}

// Generate a unique ID based on UUID and a random string
export function generateUniqueID(prefix = '') {
	return `${prefix}${generateUUID().replace('-', '')}${generateRandomString(
		5
	)}`;
}
