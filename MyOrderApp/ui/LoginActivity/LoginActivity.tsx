import { Button, Text, StyleSheet, View, Pressable } from 'react-native';
import loginStyles from '../../assets/styles/AuthStyle/login.style';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import { Checkbox, Icon, Input, Link, NativeBaseProvider } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import SocialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import signupStyles from '../../assets/styles/AuthStyle/signup.style';

const LoginActivity = () => {
	const [show, setShow] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [loaded] = useFonts({
		'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
	});

	if (!loaded) {
		return null;
	}

	const changeAuthBehavior = StyleSheet.create({
		loginStyleBehavoir: {
			top: 27,
			left: 32,
			width: 85,
			height: 2,
			backgroundColor: showRegister ? 'white' : '#de3905',
		},

		registerStyleBehavior: {
			top: 27,
			left: 32,
			width: 85,
			height: 2,
			backgroundColor: showRegister ? '#de3905' : 'white',
		},
	});

	return (
		<LinearGradient
			style={loginStyles.loginFrame}
			colors={['rgba(185, 106, 61, 0.61)', 'rgba(0, 0, 0, 0)']}
		>
			<View
				style={[loginStyles.loginFrameItem, loginStyles.loginFramePosition]}
			></View>
			<View style={[loginStyles.login, loginStyles.loginLayout]}>
				<Pressable
					style={[loginStyles.login1, loginStyles.login1Layout]}
					onPress={() => setShowRegister(false)}
				>
					<Text>{'Login'}</Text>
				</Pressable>
				<Text style={[changeAuthBehavior.loginStyleBehavoir]} />
			</View>
			<View style={[loginStyles.signUp, loginStyles.login1Layout]}>
				<Pressable
					style={[loginStyles.login1, loginStyles.login1Layout]}
					onPress={() => setShowRegister(true)}
				>
					<Text>{'Signup'}</Text>
				</Pressable>
				<Text style={[changeAuthBehavior.registerStyleBehavior]} />
			</View>
			{showRegister ? (
				<View style={[signupStyles.signupFrameLayout]}>
					<View style={signupStyles.google}>
						<SocialIcon name="gmail" size={40} color="red" />
						<SocialIcon name="facebook" size={40} color="blue" />
					</View>
					<View style={[signupStyles.orParent, signupStyles.orLayout]}>
						<Text style={[signupStyles.or, signupStyles.orTypo]}>OR</Text>
						<View style={[signupStyles.groupChild, signupStyles.groupLayout]} />
						<View style={[signupStyles.groupItem, signupStyles.groupLayout]} />
					</View>

					<View style={signupStyles.button}>
						<Button title="Signup" color="red"></Button>
					</View>
					<View
						style={[signupStyles.fullnameParent, signupStyles.fullnameLayout]}
					>
						<View
							style={[signupStyles.fullname, signupStyles.shadowfullnameLayout]}
						/>
						<NativeBaseProvider isSSR={false}>
							<SafeAreaProvider style={{ marginTop: 31, width: 320 }}>
								<Input
									borderColor="transparent"
									placeholder="Fullname"
									height="59"
									fontSize="15"
									_focus={{ borderColor: 'transparent' }}
								></Input>
							</SafeAreaProvider>
						</NativeBaseProvider>
						<Text style={[signupStyles.name, signupStyles.fullnameTypo]}>
							Fullname
						</Text>
					</View>
					<View style={[signupStyles.emailParent, signupStyles.emailLayout]}>
						<View
							style={[signupStyles.email, signupStyles.shadowEmailLayout]}
						/>
						<NativeBaseProvider isSSR={false}>
							<SafeAreaProvider style={{ marginTop: 31, width: 320 }}>
								<Input
									borderColor="transparent"
									placeholder="Email"
									height="59"
									fontSize="15"
									_focus={{ borderColor: 'transparent' }}
								></Input>
							</SafeAreaProvider>
						</NativeBaseProvider>
						<Text style={[signupStyles.userEmail, signupStyles.emailTypo]}>
							Email
						</Text>
					</View>

					<View
						style={[signupStyles.confirmpasswordParent, signupStyles.confirmpasswordLayout]}
					>
						<View
							style={[signupStyles.confirmpassword, signupStyles.shadowConfirmPasswordLayout]}
						/>
						<NativeBaseProvider isSSR={false}>
							<SafeAreaProvider style={{ marginTop: 31, width: 320 }}>
								<Input
									borderColor="transparent"
									placeholder="Confirm Password"
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
						<Text
							style={[signupStyles.userconfirmpassword, signupStyles.confirmpasswordTypo]}
						>
							Confirm Password
						</Text>
					</View>

					<View
						style={[signupStyles.passwordParent, signupStyles.passwordLayout]}
					>
						<View
							style={[signupStyles.password, signupStyles.shadowPasswordLayout]}
						/>
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
						<Text
							style={[signupStyles.userPassword, signupStyles.passwordTypo]}
						>
							Password
						</Text>
					</View>
				</View>
			) : (
				<View style={[loginStyles.loginFrameLayout]}>
					<NativeBaseProvider>
						<Link
							style={[
								loginStyles.forgotPassword,
								loginStyles.forgotPasswordFlexBox,
							]}
							href=""
						>
							Forgot password?
						</Link>
					</NativeBaseProvider>

					<View style={loginStyles.remembeRme}>
						<Text style={[loginStyles.remeberMe, loginStyles.orTypo]}>
							Remeber me
						</Text>
						<View style={loginStyles.remembeRmeInner}>
							<NativeBaseProvider>
								<Checkbox
									value="test"
									style={loginStyles.instanceChild}
									accessibilityLabel="This is a dummy checkbox"
								/>
							</NativeBaseProvider>
						</View>
					</View>
					<View style={loginStyles.google}>
						<SocialIcon name="gmail" size={40} color="red" />
						<SocialIcon name="facebook" size={40} color="blue" />
					</View>
					<View style={[loginStyles.orParent, loginStyles.loginLayout]}>
						<Text style={[loginStyles.or, loginStyles.orTypo]}>OR</Text>
						<View style={[loginStyles.groupChild, loginStyles.groupLayout]} />
						<View style={[loginStyles.groupItem, loginStyles.groupLayout]} />
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
						<Text style={[loginStyles.phone, loginStyles.phoneTypo]}>
							Email
						</Text>
					</View>
					<View
						style={[loginStyles.emailphoneGroup, loginStyles.emailphoneLayout]}
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
						<Text style={[loginStyles.phone, loginStyles.phoneTypo]}>
							Password
						</Text>
					</View>
				</View>
			)}
		</LinearGradient>
	);
};

export default LoginActivity;
