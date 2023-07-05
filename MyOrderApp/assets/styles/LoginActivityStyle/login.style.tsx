import { StyleSheet } from 'react-native';

const Border = {
	br_3xs: 10,
	br_xl: 20,
	br_12xs: 1,
};

const Color = {
	gray_100: '#181818',
	gray_200: '#121212',
	silver_100: '#c4c4c4',
	silver_200: 'rgba(196, 196, 196, 0.5)',
	whitesmoke_100: '#f3f3f3',
	whitesmoke_200: '#efeaea',
	orangered_100: '#de3905',
	orangered_200: 'rgba(222, 57, 5, 0.5)',
	tomato: '#ea4335',
	mediumseagreen: '#34a853',
	dodgerblue: '#4285f4',
	orange: '#fbbc05',
	mediumslateblue: '#7b61ff',
};

const FontSize = {
	size_sm: 14,
	size_3xs: 10,
	size_4xs: 9,
};

const loginStyles = StyleSheet.create({
	container: {
		height: 800,
		padding: 78,
	},

	loginFramePosition: {
		width: 392,
		left: 1,
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
	},
	forgotPasswordContainer: {
		color: Color.gray_100,
		top: 2,
		alignItems: 'center',
		display: 'flex',
		textAlign: 'left',
		fontSize: FontSize.size_sm,
		position: 'absolute',
	},
	forgotPasswordFlexBox: {
		alignItems: 'center',
		textAlign: 'left',
	},
	orTypo: {
		color: Color.gray_100,
		top: 0,
		alignItems: 'center',
		display: 'flex',
		textAlign: 'left',
		fontSize: FontSize.size_sm,
		position: 'absolute',
	},
	shadowLayout: {
		height: 34,
		width: 120,
		borderRadius: Border.br_xl,
		position: 'absolute',
	},
	emailphoneBg: {
		backgroundColor: Color.whitesmoke_100,
		left: 0,
	},
	google1Typo: {
		fontSize: FontSize.size_3xs,
	},
	loginLayout: {
		width: 150,
		position: 'absolute',
	},
	groupLayout: {
		height: 1,
		width: 53,
		borderTopWidth: 1,
		top: 6,
		borderColor: '#181818',
		borderStyle: 'solid',
		position: 'absolute',
	},
	login1Layout: {
		height: 27,
		width: 150,
		position: 'absolute',
	},
	shadow1Layout: {
		borderRadius: Border.br_3xs,
		position: 'absolute',
	},
	loginFlexBox: {
		justifyContent: 'center',
		textAlign: 'center',
		fontSize: FontSize.size_sm,
		alignItems: 'center',
		display: 'flex',
		left: 0,
	},
	emailphoneLayout: {
		height: 95,
		width: 320,
		left: 40,
		position: 'absolute',
	},
	phoneTypo: {
		fontSize: FontSize.size_sm,
		alignItems: 'center',
		display: 'flex',
		textAlign: 'left',
		position: 'absolute',
	},
	loginFrameChild: {
		height: 696,
		top: 104,
	},
	forgotPassword: {
		top: 396,
		left: 244,
		color: Color.mediumslateblue,
		fontSize: FontSize.size_sm,
	},
	remeberMe: {
		left: 30,
		width: 100,
		height: 23,
	},
	remembermeText: {
		color: Color.gray_100,
		top: 0,
		alignItems: 'center',
		display: 'flex',
		textAlign: 'left',
		fontSize: FontSize.size_sm,
		position: 'absolute',
	},
	instanceChild: {
		height: 20,
		width: 20,
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	remembeRmeInner: {
		width: 11,
		top: 0,
		height: 11,
		left: 0,
	},
	remembeRme: {
		top: 400,
		width: 10,
		height: 20,
		left: 40,
		position: 'absolute',
	},
	shadow: {
		left: 4,
		backgroundColor: Color.silver_200,
		top: 5,
	},
	googleChild: {
		height: 34,
		width: 120,
		borderRadius: Border.br_xl,
		position: 'absolute',
		top: 0,
	},

	google: {
		top: 578,
		left: 138,
		width: 138,
		position: 'absolute',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	or: {
		left: 68,
		width: 26,
		height: 26,
	},
	groupChild: {
		left: 0,
	},
	groupItem: {
		left: 98,
	},
	orParent: {
		top: 531,
		left: 130,
		height: 14,
	},
	login1: {
		justifyContent: 'center',
		textAlign: 'center',
		fontSize: FontSize.size_sm,
		alignItems: 'center',
		display: 'flex',
		left: 0,
		color: Color.gray_200,
		top: 0,
	},
	loginChild: {
		top: 27,
		left: 32,
		width: 85,
		height: 2,
		backgroundColor: Color.orangered_100,
		position: 'absolute',
	},
	login: {
		height: 30,
		left: 20,
		top: 104,
	},
	signUp: {
		left: 189,
		top: 104,
	},
	shadow1: {
		left: 16,
		backgroundColor: Color.orangered_200,
		width: 302,
		height: 41,
		top: 5,
	},

	login2: {
		top: 9,
		color: Color.whitesmoke_200,
		height: 22,
		width: 320,
		position: 'absolute',
	},
	button: {
		top: 460,
		width: 320,
		left: 40,
		position: 'absolute',
		borderRadius: 1,
	},
	emailphone: {
		top: 30,
		height: 65,
		width: 320,
		backgroundColor: Color.whitesmoke_100,
		left: 0,
	},

	phone: {
		height: 24,
		width: 320,
		color: Color.gray_200,
		top: 0,

		left: 0,
	},
	emailphoneParent: {
		top: 173,
	},
	emailphoneGroup: {
		top: 296,
	},
	loginFrameItem: {
		top: 90,
		borderTopLeftRadius: Border.br_xl,
		borderTopRightRadius: Border.br_xl,
		backgroundColor: '#fff',
		height: 706,
	},
	loginFrame: {
		backgroundColor: 'transparent',
		flex: 1,
		height: 800,
		overflow: 'hidden',
		width: '100%',
	},
});

export default loginStyles;
