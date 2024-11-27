import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);

  useEffect(() => {
    // Burada gerçek bir API çağrısı yapılacak
    const savedStories = localStorage.getItem('travelStories');
    if (savedStories) {
      setStories(JSON.parse(savedStories));
    }
  }, []);

  const handleSave = (story: Story) => {
    if (currentStory) {
      // Güncelleme
      const updatedStories = stories.map((s) =>
        s.id === currentStory.id ? story : s
      );
      setStories(updatedStories);
      localStorage.setItem('travelStories', JSON.stringify(updatedStories));
    } else {
      // Yeni hikaye
      const newStory = {
        ...story,
        id: Date.now(),
        likes: 0,
        comments: 0,
      };
      const newStories = [...stories, newStory];
      setStories(newStories);
      localStorage.setItem('travelStories', JSON.stringify(newStories));
    }
    setIsModalOpen(false);
    setCurrentStory(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bu hikayeyi silmek istediğinize emin misiniz?')) {
      const updatedStories = stories.filter((story) => story.id !== id);
      setStories(updatedStories);
      localStorage.setItem('travelStories', JSON.stringify(updatedStories));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gezgin Hikayeleri</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Hikaye
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Görsel
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yazar
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Okuma Süresi
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stories.map((story) => (
                <tr key={story.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-10 w-10 rounded-lg object-cover"
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
                        src={story.author.avatar}
                        alt={story.author.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="ml-2 text-sm text-gray-900">
                        {story.author.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {story.readTime}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentStory(story);
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(story.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <StoryModal
          story={currentStory}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentStory(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

interface StoryModalProps {
  story: Story | null;
  onClose: () => void;
  onSave: (story: Story) => void;
}

function StoryModal({ story, onClose, onSave }: StoryModalProps) {
  const [formData, setFormData] = useState<Story>({
    id: story?.id || 0,
    title: story?.title || '',
    excerpt: story?.excerpt || '',
    image: story?.image || '',
    author: {
      name: story?.author?.name || '',
      avatar: story?.author?.avatar || '',
    },
    readTime: story?.readTime || '5 dk',
    likes: story?.likes || 0,
    comments: story?.comments || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6">
        <h2 className="text-xl font-bold mb-4">
          {story ? 'Hikayeyi Düzenle' : 'Yeni Hikaye'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Başlık
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Özet
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Görsel URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yazar Adı
            </label>
            <input
              type="text"
              value={formData.author.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  author: { ...formData.author, name: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yazar Avatar URL
            </label>
            <input
              type="url"
              value={formData.author.avatar}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  author: { ...formData.author, avatar: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Okuma Süresi
            </label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) =>
                setFormData({ ...formData, readTime: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
