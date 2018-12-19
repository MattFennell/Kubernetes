// This file contains multipliers relative to the number of transactions per page

export const initialFetchSize: number = 2;

// If the amount above or below becomes less than this, insert more respectively
export const insertBufferAbove: number = 2;
export const insertBufferBelow: number = 2;

// If the amount above or below ever become more than this, delete respectively.
// This must be higher than the buffer + amountToAskFor
export const deleteBufferAbove: number = 7;
export const deleteBufferBelow: number = 7;

// How many to add when you add to the top or bottom
export const amountToAddAbove: number = 4;
export const amountToAddBelow: number = 4;

// How many to remove each time you remove
export const amountToRemoveAbove: number = 1;
export const amountToRemoveBelow: number = 1;
