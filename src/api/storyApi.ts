import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Story {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  readTime: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export async function getAllStories(): Promise<Story[]> {
  try {
    const response = await axios.get(`${API_URL}/stories`);
    return response.data;
  } catch (err) {
    console.error('Error fetching stories:', err);
    throw err;
  }
}

export async function getStoryById(id: number): Promise<Story | null> {
  try {
    const response = await axios.get(`${API_URL}/stories/${id}`);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    console.error('Error fetching story:', err);
    throw err;
  }
}

export async function createStory(story: Omit<Story, 'id' | 'likes' | 'comments' | 'createdAt'>): Promise<Story> {
  try {
    const response = await axios.post(`${API_URL}/stories`, story);
    return response.data;
  } catch (err) {
    console.error('Error creating story:', err);
    throw err;
  }
}

export async function updateStory(id: number, story: Partial<Story>): Promise<void> {
  try {
    await axios.put(`${API_URL}/stories/${id}`, story);
  } catch (err) {
    console.error('Error updating story:', err);
    throw err;
  }
}

export async function deleteStory(id: number): Promise<void> {
  try {
    await axios.delete(`${API_URL}/stories/${id}`);
  } catch (err) {
    console.error('Error deleting story:', err);
    throw err;
  }
}

export async function updateStoryStats(id: number, likes?: number, comments?: number): Promise<void> {
  try {
    const request = { likes, comments };
    await axios.put(`${API_URL}/stories/${id}/stats`, request);
  } catch (err) {
    console.error('Error updating story stats:', err);
    throw err;
  }
}
