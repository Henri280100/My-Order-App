import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainComponent from './MainComponent/main.component';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginComponent from './LoginComponent/login.component';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			refetchOnMount: false,
			retry: 1,
			staleTime: 5 * 1000,
		},
	},
});

const Navigation = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name="MainComponent"
						component={MainComponent}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="LoginComponent"
						component={LoginComponent}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</QueryClientProvider>
	);
};

export default Navigation;
