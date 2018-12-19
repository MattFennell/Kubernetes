import { RouteComponentProps } from 'react-router-dom';
import { InjectedFormProps } from 'redux-form';
import { UserProps } from '../Interfaces/UserProps';

export type RoutedFormProps<T> = UserProps & RouteComponentProps & InjectedFormProps<{}, T>;
