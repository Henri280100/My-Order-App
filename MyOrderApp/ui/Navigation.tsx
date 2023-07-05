import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainActivity from './MainActivity/MainActivity';
import LoginActivity from './LoginActivity/LoginActivity';
import RegisterActivity from './RegisterActivity/RegisterActivity';

const Stack = createNativeStackNavigator();

const Navigation = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="MainActivity"
					component={MainActivity}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="LoginActivity"
					component={LoginActivity}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="RegisterActivity"
					component={RegisterActivity}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigation;
