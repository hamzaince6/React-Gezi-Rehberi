import React from 'react';
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface Guide {
  id: number;
  name: string;
  image: string;
  bio: string;
  phone: string;
  email: string;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const guides: Guide[] = [
  {
    id: 1,
    name: 'Ayşe Yılmaz',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    bio: 'Profesyonel tur rehberi olarak 10 yıllık deneyime sahibim. Özellikle tarihi ve kültürel turlar konusunda uzmanım. Misafirlerime unutulmaz deneyimler yaşatmak için tutkuyla çalışıyorum.',
    phone: '+90 532 123 45 67',
    email: 'ayse.yilmaz@example.com',
    social: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
    bio: 'Doğa ve macera turları uzmanıyım. 8 yıldır profesyonel rehberlik yapıyorum. Doğa sporları ve fotoğrafçılık konularında da deneyimliyim. Her turda benzersiz rotalar ve aktiviteler sunuyorum.',
    phone: '+90 533 234 56 78',
    email: 'mehmet.demir@example.com',
    social: {
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 3,
    name: 'Zeynep Kaya',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
    bio: 'Gastronomi turları ve yerel kültür gezileri konusunda uzmanım. 12 yıllık deneyimimle, misafirlerime Türk mutfağının ve kültürünün en özel yönlerini keşfettiriyorum.',
    phone: '+90 535 345 67 89',
    email: 'zeynep.kaya@example.com',
    social: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    }
  }
];

export default function GuidesGrid() {
  return (
    <div>
      {/* Banner Section */}
      <div className="relative h-[40vh] mb-16">
        <img
          src="https://plus.unsplash.com/premium_photo-1716999413807-45be5399be7f?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Professional Guides Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
            Profesyonel Rehberlerimiz
          </h1>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-6">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="w-full h-full object-cover rounded-full border-4 border-indigo-100"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{guide.name}</h3>
                <p className="text-gray-600 mb-6 line-clamp-5">{guide.bio}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{guide.phone}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{guide.email}</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  {guide.social.facebook && (
                    <a
                      href={guide.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {guide.social.twitter && (
                    <a
                      href={guide.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {guide.social.instagram && (
                    <a
                      href={guide.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pink-600 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {guide.social.linkedin && (
                    <a
                      href={guide.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-700 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}