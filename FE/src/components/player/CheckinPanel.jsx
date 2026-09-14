import { useState, useRef } from 'react';
import Button from '../common/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CheckinPanel = ({ location, teamId, teamName, onClose, onSuccess }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
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
      const formData = new FormData();
      formData.append('teamId', teamId);
      formData.append('locationId', location._id);
      formData.append('image', imageFile);
      await api.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Đã nộp minh chứng thành công!', { duration: 4000 });
      onSuccess(location._id);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs" onClick={onClose} />

      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 panel-slide-up">
        <div className="bg-[#F5FAF6] rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.25)] max-h-[85vh] overflow-y-auto max-w-lg mx-auto border-t border-white/40">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-[#236640]/20" />
          </div>

          <div className="px-5 pb-8 pt-2">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#236640] flex items-center justify-center font-black text-lg text-white shadow-sm">
                {location.index}
              </div>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-black text-[#236640] leading-tight">
                  {location.title || `Điểm ${location.index}`}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">Đội check-in: {teamName}</p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-[#236640]/10 flex items-center justify-center text-[#236640] hover:bg-[#236640]/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mô tả nhiệm vụ */}
            {location.description && (
              <div className="bg-[#236640]/8 rounded-xl p-3.5 mb-5 border border-[#236640]/15">
                <p className="text-xs sm:text-sm font-medium text-[#0F2B1A] leading-relaxed">
                  {location.description}
                </p>
              </div>
            )}

            <div className="h-px bg-[#236640]/10 mb-4" />
            <p className="text-xs sm:text-sm font-bold text-[#236640] uppercase tracking-wider mb-2.5">
              Ảnh minh chứng
            </p>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden mb-4 aspect-video bg-black/90 shadow-sm border border-gray-200">
                <img src={imagePreview} alt="Ảnh minh chứng" className="w-full h-full object-cover" />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                  border-2 border-dashed rounded-2xl p-7
                  flex flex-col items-center justify-center gap-3
                  cursor-pointer transition-all duration-200 mb-4 bg-white/70
                  ${isDragging
                    ? 'border-[#236640] bg-[#236640]/8'
                    : 'border-[#236640]/25 hover:border-[#236640] hover:bg-white'
                  }
                `}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#236640]">
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
                  <p className="font-bold text-[#236640] text-sm">Chụp ảnh hoặc chọn từ thư viện</p>
                  <p className="text-xs text-gray-500 mt-0.5">Hỗ trợ JPG, PNG, WEBP</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files[0])}
              capture="environment"
            />

            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={!imageFile}
              className="w-full text-sm sm:text-base py-3.5 rounded-xl"
            >
              Nộp minh chứng check-in
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckinPanel;
