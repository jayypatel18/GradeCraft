import { useState, useEffect } from 'react';

const EditResultModal = ({ result, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    ct: '',
    se: '',
    as: '',
    ru: '',
    lpw: '',
    hasLPW: true,
  });
  
  useEffect(() => {
    if (result) {
      setFormData({
        courseName: result.courseName || '',
        ct: result.ct?.toString() || '',
        se: result.se?.toString() || '',
        as: result.as?.toString() || '',
        ru: result.ru?.toString() || '',
        lpw: result.lpw?.toString() || '',
        hasLPW: !!result.hasLPW,
      });
    }
  }, [result]);

  if (!isOpen) return null;
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: result._id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Result</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Course Name</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">CT Marks</label>
              <input
                type="number"
                name="ct"
                value={formData.ct}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">SE Marks</label>
              <input
                type="number"
                name="se"
                value={formData.se}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">AS Marks</label>
              <input
                type="number"
                name="as"
                value={formData.as}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                required
              />
            </div>
            
          </div>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">RU Marks</label>
                <input
                  type="number"
                  name="ru"
                  value={formData.ru}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">LPW Marks</label>
                <input
                  type="number"
                  name="lpw"
                  value={formData.lpw}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 text-sm sm:text-base"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResultModal;
