export interface RegisterResponse {
	err: number;
	mess: string;
	'access token'?: string | null;
	'refresh token'?: string | null;
	'Sending mail'?: any;
}

export interface LoginResponse {
	success: boolean;
	err: number;
	mess: string;
	'access token'?: string | null;
	'refresh token'?: string | null;
}

export interface LogoutResponse {
	err: number;
	mess: string;
}

export interface VerifyEmailResponse {
	err: number;
	mess: string;
}

export interface ForgotPasswordResponse {
	err: number;
	mess: string;
	'Sending mail'?: any;
}

export interface ResetPasswordResponse {
	err: number;
	mess: string;
}

export interface RefreshTokenResponse {
	err: number;
	mess: string;
	'access token'?: string | null;
	'refresh token'?: string | null;
}
