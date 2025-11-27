/**
 * Alert Component - Show alert messages
 */

const Alert = ({ type = 'info', message, onClose }) => {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ',
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-md flex items-center justify-between ${colors[type]}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">{icons[type]}</span>
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg font-bold cursor-pointer hover:opacity-70"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
