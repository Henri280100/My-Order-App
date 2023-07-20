import { createContext, useContext, useReducer } from 'react';
import { User } from '../api/types/user.types';

type State = {
	authUser: User | null;
};

type Action = {
	type: string;
	payload: User | null;
};

type Dispatch = (action: Action) => void;

const initialState: State = {
	authUser: null,
};

type StateContextProviderProps = { children: React.ReactNode };

const stateReducer = (state: State, action: Action) => {
	switch (action.type) {
		case 'SET_USER': {
			return {
				...state,
				authUser: action.payload,
			};
		}
		default: {
			throw new Error(`Unhandled action type`);
		}
	}
};

const StateContext = createContext<
	{ state: State; dispatch: Dispatch } | undefined
>(undefined);

const StateContextProvider = ({ children }: StateContextProviderProps) => {
	const [state, dispatch] = useReducer(stateReducer, initialState);
	const value = { state, dispatch };
	return <StateContext.Provider value={value}></StateContext.Provider>;
};

const useStateContext = () => {
	const context = useContext(StateContext);

	if (context) {
		return context;
	}

	throw new Error(`useStateContext must be used within a StateContextProvider`);
};

export { StateContextProvider, useStateContext };
