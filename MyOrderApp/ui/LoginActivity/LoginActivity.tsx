import { Button, Text, TextInput, View } from 'react-native';
import loginStyles from '../../assets/styles/LoginActivityStyle/login.style';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import { Icon, Input, NativeBaseProvider, Pressable } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const LoginActivity = () => {
	const [show, setShow] = useState(false);
	const [loaded] = useFonts({
		'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
	});

	const [email, onChangeEmail] = useState('');

	if (!loaded) {
		return null;
	}
	return (
		<LinearGradient
			style={loginStyles.loginFrame}
			colors={['rgba(185, 106, 61, 0.61)', 'rgba(0, 0, 0, 0)']}
		>
			<View
				style={[loginStyles.loginFrameItem, loginStyles.loginFramePosition]}
			/>

			<Text
				style={[loginStyles.forgotPassword, loginStyles.forgotPasswordFlexBox]}
			>
				Forgot password?
			</Text>
			<View style={loginStyles.remembeRme}>
				<Text style={[loginStyles.remeberMe, loginStyles.orTypo]}>
					Remeber me
				</Text>
				<View style={loginStyles.remembeRmeInner}>
					<View style={loginStyles.instanceChild} />
				</View>
			</View>
			<View style={loginStyles.google}>
				<View style={[loginStyles.shadow, loginStyles.shadowLayout]} />
				<View style={[loginStyles.googleChild, loginStyles.emailphoneBg]} />
				<Text
					style={[
						loginStyles.continueWithGoogleContainer,
						loginStyles.forgotPasswordFlexBox,
					]}
				>
					<Text style={loginStyles.continueWithGoogleContainer1}>
						<Text style={loginStyles.continueWith}>{`continue with `}</Text>
						<Text style={[loginStyles.google1, loginStyles.google1Typo]}>
							<Text style={loginStyles.g}>G</Text>
							<Text style={loginStyles.o}>o</Text>
							<Text style={loginStyles.o1}>o</Text>
							<Text style={loginStyles.g}>g</Text>
							<Text style={loginStyles.l}>l</Text>
							<Text style={loginStyles.o}>e</Text>
						</Text>
					</Text>
				</Text>
			</View>
			<View style={[loginStyles.orParent, loginStyles.loginLayout]}>
				<Text style={[loginStyles.or, loginStyles.orTypo]}>OR</Text>
				<View style={[loginStyles.groupChild, loginStyles.groupLayout]} />
				<View style={[loginStyles.groupItem, loginStyles.groupLayout]} />
			</View>
			<View style={[loginStyles.login, loginStyles.loginLayout]}>
				<Text style={[loginStyles.login1, loginStyles.login1Layout]}>
					Login
				</Text>
				<View style={loginStyles.loginChild} />
			</View>
			<View style={[loginStyles.signUp, loginStyles.login1Layout]}>
				<Text style={[loginStyles.login1, loginStyles.login1Layout]}>
					Sign up
				</Text>
			</View>
			<View style={loginStyles.button}>
				<Button title="Login" color="red"></Button>
			</View>
			<View
				style={[loginStyles.emailphoneParent, loginStyles.emailphoneLayout]}
			>
				<View style={[loginStyles.emailphone, loginStyles.shadow1Layout]} />
				<NativeBaseProvider isSSR={false}>
					<SafeAreaProvider style={{ marginTop: 31, width: 320 }}>
						<Input
							borderColor="transparent"
							placeholder="Password"
							height="59"
							fontSize="15"
							_focus={{ borderColor: 'transparent' }}
						></Input>
					</SafeAreaProvider>
				</NativeBaseProvider>
				<Text style={[loginStyles.phone, loginStyles.phoneTypo]}>Email</Text>
			</View>
			<View style={[loginStyles.emailphoneGroup, loginStyles.emailphoneLayout]}>
				<View style={[loginStyles.emailphone, loginStyles.shadow1Layout]} />
				<NativeBaseProvider isSSR={false}>
					<SafeAreaProvider style={{ marginTop: 31, width: 320 }}>
						<Input
							borderColor="transparent"
							placeholder="Password"
							height="59"
							fontSize="15"
							_focus={{ borderColor: 'transparent' }}
							type={show ? 'text' : 'password'}
							InputRightElement={
								<Pressable onPress={() => setShow(!show)}>
									<Icon
										as={
											<MaterialIcons
												name={show ? 'visibility' : 'visibility-off'}
											/>
										}
										size={5}
										mr="2"
										color="muted.400"
									/>
								</Pressable>
							}
						></Input>
					</SafeAreaProvider>
				</NativeBaseProvider>
				<Text style={[loginStyles.phone, loginStyles.phoneTypo]}>Password</Text>
			</View>
		</LinearGradient>
	);
};

export default LoginActivity;
