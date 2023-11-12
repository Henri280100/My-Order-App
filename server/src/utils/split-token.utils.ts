class SplitTokenUtils {
	/**
	 * Splits a JWT token into its header, payload, and signature.
	 *
	 * @param token The JWT token to split.
	 * @returns An array containing the header, payload, and signature of the token.
	 */
	private SplitJwtToken(token: any) {
		console.log(token);
		return token.split(' ');
	}

	/**
	 * Gets the header of a JWT token.
	 *
	 * @param token The JWT token.
	 * @returns The header of the token.
	 */
	getHeader(token: any) {
		return this.SplitJwtToken(token)[0];
	}

	/**
	 * Gets the payload of a JWT token.
	 *
	 * @param token The JWT token.
	 * @returns The payload of the token.
	 */
	getPayLoad(token: any) {
		console.log(token);
		return this.SplitJwtToken(token)[1];
	}

	/**
	 * Gets the signature of a JWT token.
	 *
	 * @param token The JWT token.
	 * @returns The signature of the token.
	 */
	getSignature(token: any) {
		return this.SplitJwtToken(token)[2];
	}
}

const splitTokenUtils = new SplitTokenUtils();
export default splitTokenUtils;
