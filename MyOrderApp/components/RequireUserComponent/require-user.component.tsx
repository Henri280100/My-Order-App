import { useCookies } from 'react-cookie';
import { useStateContext } from '../../context';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../../api/services/user.service';
import { LoaderComponent } from '../LoaderComponent/loader.component';

const RequireUser = ({ allowedRoles }: { allowedRoles: string[] }) => {
	const [cookies] = useCookies(['logged_in']);
	const stateContext = useStateContext();
	const route = useRoute();

	const {
		isLoading,
		isFetching,
		data: user,
	} = useQuery(['authUser'], getUser, {
		retry: 1,
		select: (data) => data.data.user,
		onSuccess: (data) => {
			stateContext.dispatch({ type: 'SET_USER', payload: data });
		},
	});

	console.log(cookies);

	const loading = isLoading || isFetching;

	if (loading) {
		return <LoaderComponent />;
	}

	return (cookies.logged_in || user) &&
		allowedRoles.includes(user?.role_code as string) ? (
		<></>
	) : cookies.logged_in && user ? (
		<></>
	) : (
		<></>
	);
};
