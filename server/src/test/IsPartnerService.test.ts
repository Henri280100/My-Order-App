const IsPartnerService =
	require('../services/restaurant.service').IsPartnerService;
import { ErrorCodes } from '../enums';

describe('IsPartnerService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
});
const queryData = {
	findOne: jest.fn(),
};
describe('IsPartnerService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns an error when the email is not found', async () => {
		queryData.findOne.mockResolvedValue(null);

		const response = await IsPartnerService({
			queryData,
			partnerEmail: 'test@test.com',
			isPartner: true,
		});

		expect(response.success).toBe(false);

		expect(response.err).toBe(ErrorCodes.EMAIL_NOT_FOUND);

		expect(response.mess).toBe(
			"We can't find the email address in our database."
		);
	});

	it('returns a success response when the user is not a partner', async () => {
		queryData.findOne.mockResolvedValue({
			partnerEmail: 'test@test.com',
			isPartner: false,
		});

		const response = await IsPartnerService({
			queryData,
			partnerEmail: 'test@test.com',
			isPartner: true,
		});

		expect(response.success).toBe(true);

		expect(response.isPartner).toBe(false);

		expect(response.err).toBe(ErrorCodes.NOT_ALREADY_A_PARTNER);

		expect(response.mess).toBe('You are not a partner yet.');
	});

	it('returns a success response when the user is already a partner', async () => {
		queryData.findOne.mockResolvedValue({
			partnerEmail: 'test@test.com',
			isPartner: true,
		});

		const response = await IsPartnerService({
			queryData,
			partnerEmail: 'test@test.com',
			isPartner: true,
		});

		expect(response.success).toBe(false);

		expect(response.isPartner).toBe(true);

		expect(response.err).toBe(ErrorCodes.IS_ALREADY_A_PARTNER);

		expect(response.mess).toBe(
			'You are already a partner with us. Thank you for your support!'
		);
	});
});
