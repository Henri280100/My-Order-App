import { Button, Text, View, Pressable } from 'react-native';
import { Icon, Input, NativeBaseProvider } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { TypeOf } from 'zod';
import { registerSchema } from '../../helpers/validations';
import SocialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import signupStyles from '../../assets/styles/AuthStyle/signup.style';

export type RegisterInput = TypeOf<typeof registerSchema>;

const RegisterComponent = () => {
	const [show, setShow] = useState(false);

	return (
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
			<View style={[signupStyles.fullnameParent, signupStyles.fullnameLayout]}>
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
				<View style={[signupStyles.email, signupStyles.shadowEmailLayout]} />
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
				style={[
					signupStyles.confirmpasswordParent,
					signupStyles.confirmpasswordLayout,
				]}
			>
				<View
					style={[
						signupStyles.confirmpassword,
						signupStyles.shadowConfirmPasswordLayout,
					]}
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
					style={[
						signupStyles.userconfirmpassword,
						signupStyles.confirmpasswordTypo,
					]}
				>
					Confirm Password
				</Text>
			</View>

			<View style={[signupStyles.passwordParent, signupStyles.passwordLayout]}>
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
				<Text style={[signupStyles.userPassword, signupStyles.passwordTypo]}>
					Password
				</Text>
			</View>
		</View>
	);
};

export default RegisterComponent;
