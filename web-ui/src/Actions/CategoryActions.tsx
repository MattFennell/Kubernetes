import Category from '../Models/Category';

/*
 * Defining every action name constant here
 * Using Typescript's enum
 * Typescript understands enum better 
 */
export enum ActionTypes {
  SET_CATEGORIES = 'SET_CATEGORIES'
}

/*
 * Defining return types of actions 
 * Every action returns a type and a payload
 */
export interface SetCategories {
  type: ActionTypes.SET_CATEGORIES;
  payload: { categories: Category[] };
}

/*
 * Define actions creators
 * Returning the right Action for each function
 */
export const setCategories = (categories: Category[]): SetCategories => {
  return {
    type: ActionTypes.SET_CATEGORIES,
    payload: {
      categories
    }
  };
};

/*
 * Defining the Action type
 * It can be one of the types defining in our action directory
 * It will be useful to tell typescript about our types in our reducer
 */
export type Action = SetCategories;
