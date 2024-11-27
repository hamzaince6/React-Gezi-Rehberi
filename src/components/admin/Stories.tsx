import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getAllStories, createStory, updateStory, deleteStory, type Story } from '../../api/storyApi';

interface Story {
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
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await getAllStories();
      setStories(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Hikayeleri yüklerken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const storyData = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      image: formData.get('image') as string || 'https://placehold.co/1920x1080',
      author: {
        name: formData.get('authorName') as string,
        avatar: formData.get('authorAvatar') as string || 'https://placehold.co/150x150'
      },
      readTime: formData.get('readTime') as string
    };

    try {
      if (currentStory) {
        await updateStory(currentStory.id, storyData);
      } else {
        await createStory(storyData);
      }
      
      await fetchStories();
      setIsModalOpen(false);
      setCurrentStory(null);
      form.reset();
    } catch (err) {
      console.error('Error saving story:', err);
      setError('Hikaye kaydedilirken bir hata oluştu.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu hikayeyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteStory(id);
      await fetchStories();
    } catch (err) {
      console.error('Error deleting story:', err);
      setError('Hikaye silinirken bir hata oluştu.');
    }
  };

  const handleEdit = (story: Story) => {
    setCurrentStory(story);
    setIsModalOpen(true);
  };

  const getPlaceholderImage = () => 'https://placehold.co/1920x1080';
  const getPlaceholderAvatar = () => 'https://placehold.co/150x150';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gezgin Hikayeleri</h1>
        <button
          onClick={() => {
            setCurrentStory(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Yeni Hikaye Ekle
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Görsel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başlık & İçerik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yazar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stories.map((story) => (
              <tr key={story.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={story.image || getPlaceholderImage()}
                    alt={story.title}
                    className="h-20 w-32 object-cover rounded-lg"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {story.title}
                  </div>
                  <div className="text-sm text-gray-500">{story.excerpt}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={story.author.avatar || getPlaceholderAvatar()}
                      alt={story.author.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {story.author.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(story)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {currentStory ? 'Hikaye Düzenle' : 'Yeni Hikaye'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Başlık
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={currentStory?.title}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    İçerik
                  </label>
                  <textarea
                    name="excerpt"
                    defaultValue={currentStory?.excerpt}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Görsel URL (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    name="image"
                    defaultValue={currentStory?.image}
                    placeholder="https://placehold.co/1920x1080"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Yazar Adı
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    defaultValue={currentStory?.author.name}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Yazar Avatar URL (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    name="authorAvatar"
                    defaultValue={currentStory?.author.avatar}
                    placeholder="https://placehold.co/150x150"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Okuma Süresi
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    defaultValue={currentStory?.readTime}
                    required
                    placeholder="5 dk"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentStory(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {currentStory ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
