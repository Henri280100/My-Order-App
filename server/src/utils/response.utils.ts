export interface RegisterResponse {
	success: boolean;
	err: number;
	mess: string;
	accessToken?: string | null;
	refreshToken?: string | null;
	authSendingMail?: any;
	result?: any | null;
}

export interface LoginResponse {
	success: boolean;
	err: number;
	mess: string;
	accessToken?: string | null;
	refreshToken?: string | null;
	result?: any;
	headers?: any;
}

export interface LogoutResponse {
	success: boolean;
	err: number;
	mess: string;
}

export interface VerifyEmailResponse {
	success: boolean;
	err: number;
	mess: string;
}

export interface ResendEmailResponse {
	success: boolean;
	err: number;
	mess: string;
	resendEmail?: any;
}

export interface ForgotPasswordResponse {
	success: boolean;
	err: number;
	mess: string;
	fpSendingMail?: any;
}

export interface ResetPasswordResponse {
	success: boolean;
	err: number;
	mess: string;
}

export interface RefreshTokenResponse {
	success: boolean;
	err: number;
	mess: string;
	accessToken?: string | null;
	refreshToken?: string | null;
}

// Restaurant response
export interface PartnerRegisterResponse {
	success: boolean;
	err: number;
	mess: string;
	sendingVerificationMail?: any;
	accessToken?: any;
	refreshToken?: any;
	result?: any | null;
}

export interface IsPartnerRegisteredResponse {
	success: boolean;
	err: number;
	mess: string;
	isPartner?: boolean;
}

// restaurant end

// Delivery driver response

// End
