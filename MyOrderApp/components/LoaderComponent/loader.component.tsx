import { View, ActivityIndicator } from 'react-native';
import { loadStyles } from '../../assets/styles/LoaderStyle/loader.style';

export const LoaderComponent = () => {
	return (
		<View style={[loadStyles.container, loadStyles.horizontal]}>
			<ActivityIndicator />
			<ActivityIndicator size={'large'} color="#00ff00" />
		</View>
	);
};


