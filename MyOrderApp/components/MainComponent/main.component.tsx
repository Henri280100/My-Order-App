import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import styles from '../../assets/styles/MainActivityStyle/mainactivity.style';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';

export default function MainComponent({ navigation }: any) {
	const [animating, setAnimating] = useState(false);

	setTimeout(() => {
		navigation.navigate('LoginComponent');
	}, 4000);
	const [loaded] = useFonts({
		'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
	});

	if (!loaded) {
		return null;
	}

	return (
		<LinearGradient colors={['rgba(185, 106, 61, 0.75)', '#FFF']}>
			<View style={styles.container}>
				<Text style={[styles.textView, { fontFamily: 'Poppins-Medium' }]}>
					Lazy Order
				</Text>
				<StatusBar style="auto" />
			</View>
		</LinearGradient>
	);
}
