import { findMany, insertOne, updateOne, deleteOne } from '../lib/db';

export async function getUsers() {
  try {
    return await findMany('users', {});
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function createUser(userData: any) {
  try {
    return await insertOne('users', userData);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(userId: string, userData: any) {
  try {
    return await updateOne('users', { _id: userId }, userData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    return await deleteOne('users', { _id: userId });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
} 