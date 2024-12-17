import React, { useState } from "react";

const Contact: React.FC = () => {
    // Form state
    const [formData, setFormData] = useState({
        ad: "",
        eposta: "",
        mesaj: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basit doğrulama
        if (!formData.ad || !formData.eposta || !formData.mesaj) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        // Form verisi işleme (örneğin, bir API'ye gönderme)
        console.log("Form submitted:", formData);
        alert("Mesajınız gönderildi!");
        setFormData({ ad: "", eposta: "", mesaj: "" }); // Formu sıfırla
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Full-width Banner Section */}
            <div className="relative h-[50vh] overflow-hidden">
                <img
                    src="https://plus.unsplash.com/premium_photo-1716999413807-45be5399be7f"
                    alt="Contact Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"/>
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
                        İletişim
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                    {/* Contact Information Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">İletişim Bilgileri</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-600">info@gezirehberi.com</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <p className="text-gray-600">+90 (555) 123 45 67</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-gray-600">İstanbul, Türkiye</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sık Sorulan Sorular</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Nasıl rezervasyon yapabilirim?</h3>
                                <p className="text-gray-600">İlgili tur sayfasından "Rezervasyon Yap" butonuna tıklayarak kolayca rezervasyon yapabilirsiniz.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">İptal politikanız nedir?</h3>
                                <p className="text-gray-600">Turlarımızı başlangıç tarihinden 48 saat öncesine kadar ücretsiz iptal edebilirsiniz.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Grup indirimi var mı?</h3>
                                <p className="text-gray-600">10 kişi ve üzeri grup rezervasyonlarında özel indirimler sunuyoruz.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="w-full h-[400px] my-16 bg-gray-200 overflow-hidden">
                    <div className="w-full h-full rounded-lg overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2755075542196!2d28.97762611571675!3d41.03705897929861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8ca058b28c20b6c3!2zVGFrc2ltIE1leWRhbsSxLCBHw7xtw7zFn3N1eXUsIDM0NDM1IEJleW_En2x1L8Swc3RhbmJ1bA!5e0!3m2!1str!2str!4v1645789876543!5m2!1str!2str"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>


                {/* Contact Form */}
                <div className="max-w-7xl mx-auto px-4 mb-16">
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h2 className="text-3xl font-bold mb-6">Mesaj Gönderin</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Adınız</label>
                                <input
                                    type="text"
                                    name="ad"
                                    value={formData.ad}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresiniz</label>
                                <input
                                    type="email"
                                    name="eposta"
                                    value={formData.eposta}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
                                <textarea
                                    name="mesaj"
                                    value={formData.mesaj}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                            >
                                Mesaj Gönder
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;