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

const signupStyles = StyleSheet.create({
	fullnameParent: {
		top: 155,
	},
	fullnameLayout: {
		height: 95,
		width: 320,
		left: 40,
		position: 'absolute',
	},
	shadowfullnameLayout: {
		borderRadius: Border.br_3xs,
		position: 'absolute',
	},
	fullname: {
		top: 30,
		height: 65,
		width: 320,
		backgroundColor: Color.whitesmoke_100,
		left: 0,
	},
	name: {
		height: 24,
		width: 320,
		color: Color.gray_200,
		top: 0,

		left: 0,
	},
	fullnameTypo: {
		fontSize: FontSize.size_sm,
		alignItems: 'center',
		display: 'flex',
		textAlign: 'left',
		position: 'absolute',
	},

	emailParent: {
		top: 260,
	},
	emailLayout: {
		height: 95,
		width: 320,
		left: 40,
		position: 'absolute',
	},
	email: {
		top: 30,
		height: 65,
		width: 320,
		backgroundColor: Color.whitesmoke_100,
		left: 0,
	},
	shadowEmailLayout: {
		borderRadius: Border.br_3xs,
		position: 'absolute',
	},
	userEmail: {
		height: 24,
		width: 320,
		color: Color.gray_200,
		top: 0,

		left: 0,
	},
	emailTypo: {
		fontSize: FontSize.size_sm,
		alignItems: 'center',
		display: 'flex',
		textAlign: 'left',
		position: 'absolute',
	},

	passwordParent: {
		top: 365,
	},
	passwordLayout: {
		height: 95,
		width: 320,
		left: 40,
		position: 'absolute',
	},
	password: {
		top: 30,
		height: 65,
		width: 320,
		backgroundColor: Color.whitesmoke_100,
		left: 0,
	},
	shadowPasswordLayout: {
		borderRadius: Border.br_3xs,
		position: 'absolute',
	},
	userPassword: {
		height: 24,
		width: 320,
		color: Color.gray_200,
		top: 0,

		left: 0,
	},
	passwordTypo: {
		fontSize: FontSize.size_sm,
		alignItems: 'center',
		display: 'flex',
		textAlign: 'left',
		position: 'absolute',
	},

    confirmpasswordParent: {
		top: 472,
	},
	confirmpasswordLayout: {
		height: 95,
		width: 320,
		left: 40,
		position: 'absolute',
	},
	confirmpassword: {
		top: 30,
		height: 65,
		width: 320,
		backgroundColor: Color.whitesmoke_100,
		left: 0,
	},
	shadowConfirmPasswordLayout: {
		borderRadius: Border.br_3xs,
		position: 'absolute',
	},
	userconfirmpassword: {
		height: 24,
		width: 320,
		color: Color.gray_200,
		top: 0,

		left: 0,
	},
	confirmpasswordTypo: {
		fontSize: FontSize.size_sm,
		alignItems: 'center',
		display: 'flex',
		textAlign: 'left',
		position: 'absolute',
	},

	button: {
		top: 598,
		width: 320,
		left: 40,
		position: 'absolute',
		borderRadius: 1,
	},

	orParent: {
		top: 660,
		left: 130,
		height: 14,
	},
	or: {
		left: 68,
		width: 26,
		height: 26,
	},

	orLayout: {
		width: 150,
		position: 'absolute',
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
	groupChild: {
		left: 0,
	},
	groupItem: {
		left: 98,
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
	signupFrameLayout: {
		width: 390,
		left: 1,
		position: 'absolute',
		top: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
	google: {
		top: 682,
		left: 138,
		width: 138,
		position: 'absolute',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
});

export default signupStyles;
