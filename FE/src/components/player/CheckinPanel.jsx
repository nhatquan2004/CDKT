import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import Button from '../common/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CheckinPanel = ({ location, teamId, teamName, onClose, onSuccess }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      toast.error('Vui lòng chọn ảnh minh chứng!');
      return;
    }
    if (!teamId) {
      toast.error('Không tìm thấy thông tin team. Vui lòng quay về và chọn team lại.');
      return;
    }

    setLoading(true);
    try {
      // Tối ưu tốc độ: Vừa nén ảnh trên máy vừa xin chữ ký từ BE cùng một lúc (song song)
      setLoadingStep('Đang chuẩn bị ảnh...');
      const compressPromise = imageCompression(imageFile, {
        maxSizeMB: 0.6,
        maxWidthOrHeight: 1600, // Chuẩn 1600px cực kỳ sắc nét cho BTC xem mà file chỉ ~300-500KB
        useWebWorker: true,
        initialQuality: 0.8,
      });
      const sigPromise = api.post('/cloudinary/signature');

      const [compressed, { data: sigData }] = await Promise.all([compressPromise, sigPromise]);

      // Bước 3: Upload thẳng lên Cloudinary — bỏ qua Render hoàn toàn
      setLoadingStep('Đang tải ảnh lên Cloudinary...');
      const uploadForm = new FormData();
      uploadForm.append('file', compressed);
      uploadForm.append('api_key', sigData.apiKey);
      uploadForm.append('timestamp', sigData.timestamp);
      uploadForm.append('signature', sigData.signature);
      uploadForm.append('folder', sigData.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        { method: 'POST', body: uploadForm }
      );
      if (!uploadRes.ok) throw new Error('Upload ảnh thất bại');
      const { secure_url: imageUrl } = await uploadRes.json();

      // Bước 4: Gửi URL về backend để lưu submission (chỉ gửi text, cực nhẹ)
      setLoadingStep('Đang lưu minh chứng...');
      await api.post('/submissions', {
        teamId,
        locationId: location._id,
        imageUrl,
      });

      toast.success('Đã nộp minh chứng thành công!', { duration: 4000 });
      onSuccess(location._id);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs" onClick={onClose} />

      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 panel-slide-up">
        <div className="bg-[#FAFDFB] rounded-t-[32px] shadow-[0_-12px_48px_rgba(0,0,0,0.22)] max-h-[85vh] overflow-y-auto max-w-lg mx-auto border-t border-white/60">
          {/* Handle thanh kéo trên cùng */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1 rounded-full bg-gray-300/80" />
          </div>

          <div className="px-5 pb-7 pt-2">
            {/* Header thanh lịch */}
            <div className="flex items-center gap-3.5 mb-5 pb-3.5 border-b border-gray-100">
              <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1e633d] to-[#0f3d24] flex items-center justify-center font-black text-lg text-white shadow-[0_4px_12px_rgba(30,99,61,0.28)] border border-emerald-400/20">
                {location.index}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-black text-[#0f3d24] leading-tight truncate">
                  {location.title || `Điểm ${location.index}`}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-gray-500 font-medium">Đội check-in:</span>
                  <span className="text-xs font-bold text-[#1e633d] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {teamName}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors"
                aria-label="Đóng"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mô tả nhiệm vụ - phong cách tối giản sang trọng */}
            {location.description && (
              <div className="mb-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e633d]" />
                  <p className="text-[11px] font-extrabold text-[#1e633d] uppercase tracking-wider">
                    NỘI DUNG CHECK IN:
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-emerald-900/10 border-l-4 border-l-[#1e633d] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed">
                    {location.description}
                  </p>
                </div>
              </div>
            )}

            {/* Khu vực ảnh minh chứng */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e633d]" />
                <p className="text-[11px] font-extrabold text-[#1e633d] uppercase tracking-wider">
                  ẢNH MINH CHỨNG
                </p>
              </div>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-md border border-gray-200">
                  <img src={imagePreview} alt="Ảnh minh chứng" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border border-dashed rounded-2xl p-6
                    flex flex-col items-center justify-center gap-2.5
                    cursor-pointer transition-all duration-200 group bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]
                    ${isDragging
                      ? 'border-[#1e633d] bg-emerald-50/50 scale-[0.99]'
                      : 'border-emerald-900/20 hover:border-[#1e633d] hover:bg-emerald-50/30'
                    }
                  `}
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100/70 border border-emerald-100 flex items-center justify-center text-[#1e633d] transition-all group-hover:scale-105 shadow-xs">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-[#0f3d24] text-sm group-hover:text-[#1e633d] transition-colors">
                      Chụp ảnh hoặc chọn từ thư viện
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      Chạm để tải lên ảnh check-in
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </div>

            {/* Nút nộp minh chứng */}
            <button
              onClick={handleSubmit}
              disabled={!imageFile || loading}
              className={`
                w-full py-3.5 rounded-2xl font-black text-sm sm:text-base tracking-wide transition-all duration-200 flex items-center justify-center gap-2
                ${!imageFile || loading
                  ? 'bg-gray-200/90 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#175233] to-[#0f3d24] text-white shadow-[0_6px_20px_rgba(23,82,51,0.30)] hover:shadow-[0_8px_26px_rgba(23,82,51,0.40)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                }
              `}
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              <span>{loading && loadingStep ? loadingStep : 'Nộp minh chứng check-in'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckinPanel;
