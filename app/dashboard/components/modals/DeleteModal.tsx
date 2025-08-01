import React, { useCallback, useEffect, useRef, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoClose, IoWarningOutline } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";

interface DeleteModalProps {
  componentName: string;
  hideDeleteModal: () => void;
  deleteFn: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  componentName,
  hideDeleteModal,
  deleteFn,
}) => {
  // State management
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  // Handle delete with loading state
  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteFn();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteFn]);

  // Handle escape key and outside click
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        hideDeleteModal();
      }
    },
    [hideDeleteModal, isDeleting]
  );

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !isDeleting
      ) {
        hideDeleteModal();
      }
    },
    [hideDeleteModal, isDeleting]
  );

  // Focus management and animations
  useEffect(() => {
    // Add entrance animation
    setShowAnimation(true);

    // Focus the delete button for keyboard accessibility
    if (deleteButtonRef.current) {
      deleteButtonRef.current.focus();
    }

    // Add event listeners
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOutsideClick);

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "unset";
    };
  }, [handleEscape, handleOutsideClick]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out ${
          showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        role="dialog"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        aria-modal="true"
      >
        {/* Header */}
        <div className="relative p-6 text-center">
          <button
            onClick={hideDeleteModal}
            disabled={isDeleting}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <IoClose size={20} />
          </button>

          {/* Warning Icon with Animation */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 relative">
            <RiDeleteBin6Line className="text-red-600" size={32} />
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
          </div>

          <h1
            id="delete-modal-title"
            className="text-xl font-bold text-gray-900 mb-2"
          >
            Delete {componentName}?
          </h1>

          <p
            id="delete-modal-description"
            className="text-gray-600 text-sm leading-relaxed"
          >
            This action cannot be undone. This will permanently delete the{" "}
            {componentName.toLowerCase()} and remove all associated data.
          </p>
        </div>

        {/* Warning Section */}
        <div className="mx-6 mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <FiAlertTriangle
            className="text-amber-600 flex-shrink-0 mt-0.5"
            size={18}
          />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Be careful!</p>
            <p>
              Make sure you really want to delete this{" "}
              {componentName.toLowerCase()}. This action is permanent.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
          <button
            onClick={hideDeleteModal}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            ref={deleteButtonRef}
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <RiDeleteBin6Line size={18} />
                Yes, Delete
              </>
            )}
          </button>
        </div>

        {/* Progress indicator */}
        {isDeleting && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
            <div className="h-full bg-red-600 animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteModal;
