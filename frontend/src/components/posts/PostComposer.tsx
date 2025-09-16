'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/design-system';
import { Camera, Image, Smile, MapPin, Calendar, X } from 'lucide-react';
import type { CreatePostForm, User, AIPersona } from '@/types';

interface PostComposerProps {
  user: User | AIPersona;
  onSubmit: (post: CreatePostForm) => Promise<void>;
  onCancel?: () => void;
  parentPostId?: string;
  placeholder?: string;
  maxLength?: number;
  showActions?: boolean;
  className?: string;
}

export function PostComposer({
  user,
  onSubmit,
  onCancel,
  parentPostId,
  placeholder = "What's happening?",
  maxLength = 280,
  showActions = true,
  className,
}: PostComposerProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charactersLeft = maxLength - content.length;
  const isOverLimit = charactersLeft < 0;
  const isEmpty = content.trim().length === 0 && images.length === 0;

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    // Limit to 4 images max (X-like behavior)
    const maxImages = 4;
    const remainingSlots = maxImages - images.length;
    const newImages = imageFiles.slice(0, remainingSlots);

    setImages(prev => [...prev, ...newImages]);
  }, [images.length]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isEmpty || isOverLimit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
        parentPostId,
      });

      // Reset form
      setContent('');
      setImages([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to submit post:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, images, isEmpty, isOverLimit, isSubmitting, onSubmit, parentPostId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !isEmpty && !isOverLimit) {
      e.preventDefault();
      handleSubmit();
    }
  }, [isEmpty, isOverLimit, handleSubmit]);

  const getPoliticalAlignment = () => {
    if ('politicalAlignment' in user && user.politicalAlignment) {
      return user.politicalAlignment.position;
    }
    return undefined;
  };

  const politicalAlignment = getPoliticalAlignment();

  return (
    <div className={cn('border-b border-x-border bg-white dark:bg-x-dark', className)}>
      <div className="p-4">
        <div className="flex space-x-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
              alt={user.displayName || user.username}
              className="w-12 h-12 rounded-full"
            />
          </div>

          {/* Composer Content */}
          <div className="flex-1 min-w-0">
            {/* Text Area */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full resize-none border-none bg-transparent text-xl placeholder-x-text-secondary focus:outline-none focus:ring-0 dark:text-x-text-dark dark:placeholder-x-text-secondary-dark"
                rows={3}
                maxLength={maxLength * 2} // Allow typing over limit to show warning
              />
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className={cn(
                'mt-3 grid gap-2',
                images.length === 1 && 'grid-cols-1',
                images.length === 2 && 'grid-cols-2',
                images.length === 3 && 'grid-cols-2',
                images.length === 4 && 'grid-cols-2'
              )}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={cn(
                      'relative rounded-2xl overflow-hidden border border-x-border',
                      images.length === 3 && index === 0 && 'row-span-2'
                    )}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/80 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions Bar */}
            {showActions && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  {/* Image Upload */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={images.length >= 4}
                    className="p-2 text-x-blue hover:bg-x-blue-light/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Add images"
                  >
                    <Image className="w-5 h-5" />
                  </button>

                  {/* Additional actions (could be expanded) */}
                  <button
                    disabled
                    className="p-2 text-x-light-gray hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Add emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <button
                    disabled
                    className="p-2 text-x-light-gray hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Add location"
                  >
                    <MapPin className="w-5 h-5" />
                  </button>

                  <button
                    disabled
                    className="p-2 text-x-light-gray hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Schedule post"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Character Counter */}
                  {content.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          'w-8 h-8 relative',
                          isOverLimit && 'text-red-500'
                        )}
                      >
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="stroke-current text-gray-200 dark:text-gray-700"
                            fill="none"
                            strokeWidth="3"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={cn(
                              'stroke-current transition-colors',
                              isOverLimit ? 'text-red-500' : 'text-x-blue'
                            )}
                            fill="none"
                            strokeWidth="3"
                            strokeDasharray={`${Math.min(100, (content.length / maxLength) * 100)}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                      </div>
                      {charactersLeft < 20 && (
                        <span className={cn(
                          'text-sm font-medium',
                          isOverLimit ? 'text-red-500' : 'text-x-text-secondary'
                        )}>
                          {charactersLeft}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {onCancel && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      onClick={handleSubmit}
                      disabled={isEmpty || isOverLimit || isSubmitting}
                      isLoading={isSubmitting}
                      className={cn(
                        'rounded-full px-6 font-semibold',
                        politicalAlignment && `bg-political-${politicalAlignment}-500 hover:bg-political-${politicalAlignment}-600`
                      )}
                    >
                      {parentPostId ? 'Reply' : 'Post'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}