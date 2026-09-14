import { useState } from 'react';
import Button from '../common/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

const LocationEditForm = ({ location, onUpdated }) => {
  const [title, setTitle] = useState(location.title || '');
  const [description, setDescription] = useState(location.description || '');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.put(`/locations/${location._id}`, { title, description });
      toast.success(`Đã cập nhật Điểm ${location.index}!`);
      onUpdated(data.location);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-emerald-900/10 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-emerald-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3.5">
          <span className="w-9 h-9 rounded-xl bg-[#236640] text-[#F5FAF6] font-extrabold text-sm flex items-center justify-center shadow-sm flex-shrink-0">
            {location.index}
          </span>
          <div>
            <h3 className="font-bold text-[#0F2B1A] text-sm sm:text-base">
              {title || <span className="italic text-gray-400">Chưa đặt tên điểm...</span>}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 max-w-sm sm:max-w-md">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 hidden sm:inline-block">
            {expanded ? 'Thu gọn' : 'Chỉnh sửa'}
          </span>
          <svg
            className={`w-4 h-4 text-emerald-800 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-3 border-t border-emerald-900/5 bg-gray-50/40">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Tên điểm check-in
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tên điểm..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:border-[#236640] focus:ring-2 focus:ring-[#236640]/15 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Nội dung nhiệm vụ
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả thử thách hoặc hướng dẫn check-in..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:border-[#236640] focus:ring-2 focus:ring-[#236640]/15 text-sm transition-all resize-none"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button onClick={handleSave} loading={loading} className="px-6 py-2.5 text-sm">
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationEditForm;
