// app/admin/upload/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, X, ChevronLeft, ChevronRight, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface UploadItem {
  id: string;
  file: File | null;
  previewUrl: string;
  uploading: boolean;
  error?: string;
}

export default function UploadPage() {
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [successCount, setSuccessCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    
    const newItems: UploadItem[] = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      file,
      previewUrl: URL.createObjectURL(file),
      uploading: false,
    }));

    setUploadItems(prev => [...prev, ...newItems]);
    setGlobalError('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeItem = (id: string) => {
    setUploadItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      // Adjust current index if needed
      if (currentIndex >= newItems.length) {
        setCurrentIndex(Math.max(0, newItems.length - 1));
      }
      return newItems;
    });
  };

  const clearAll = () => {
    setUploadItems([]);
    setCurrentIndex(0);
    setGlobalError('');
    setSuccessCount(0);
  };

  const nextItem = () => {
    setCurrentIndex(prev => Math.min(prev + 1, uploadItems.length - 1));
  };

  const prevItem = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const uploadSingleItem = async (item: UploadItem): Promise<boolean> => {
    try {
      const uploadData = new FormData();
      uploadData.append('image', item.file!);
      
      // Auto-generate title from filename
      const autoTitle = item.file!.name.replace(/\.[^/.]+$/, "");
      uploadData.append('title', autoTitle);
      uploadData.append('description', `Uploaded document: ${autoTitle}`);
      uploadData.append('tags', 'auto-upload,bulk-upload');

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Upload failed:', error);
      return false;
    }
  };

  const handleBulkUpload = async () => {
    if (uploadItems.length === 0) {
      setGlobalError('Please select at least one file to upload');
      return;
    }

    setLoading(true);
    setGlobalError('');
    setSuccessCount(0);

    try {
      // Upload all items in parallel for better performance
      const uploadPromises = uploadItems.map(async (item, index) => {
        // Update UI to show uploading state
        setUploadItems(prev => 
          prev.map(prevItem => 
            prevItem.id === item.id ? { ...prevItem, uploading: true } : prevItem
          )
        );

        const success = await uploadSingleItem(item);

        // Update UI to show result
        setUploadItems(prev => 
          prev.map(prevItem => 
            prevItem.id === item.id 
              ? { 
                  ...prevItem, 
                  uploading: false, 
                  error: success ? undefined : 'Upload failed' 
                } 
              : prevItem
          )
        );

        if (success) {
          setSuccessCount(prev => prev + 1);
        }

        return success;
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(success => success).length;

      if (successfulUploads === uploadItems.length) {
        // All successful
        setTimeout(() => {
          router.push('/admin/images');
        }, 1000);
      } else if (successfulUploads > 0) {
        // Some successful
        setGlobalError(`${successfulUploads}/${uploadItems.length} files uploaded successfully. ${uploadItems.length - successfulUploads} failed.`);
      } else {
        // All failed
        setGlobalError('All uploads failed. Please try again.');
      }
    } catch (error) {
      setGlobalError('Upload process failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentItem = uploadItems[currentIndex];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Upload Packages</h1>
          <p className="text-muted-foreground mt-1">Upload and process delivery package images</p>
        </div>
        
        <div className="flex gap-2">
          {uploadItems.length > 0 && (
            <Button
              type="button"
              onClick={clearAll}
              variant="outline"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* File Selection Area */}
      <Card>
        <CardContent className="p-8">
          <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center hover:border-primary/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-4"
            >
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Select images to upload
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Drag and drop or click to select multiple files
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported: JPG, PNG, PDF, etc.
                </p>
              </div>
              <Button variant="outline" className="mt-4">
                Browse Files
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Upload Stats */}
      {uploadItems.length > 0 && (
        <Alert className="bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {uploadItems.length} file{uploadItems.length !== 1 ? 's' : ''}
              </Badge>
              {successCount > 0 && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">{successCount} uploaded successfully</span>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Ready to upload
            </div>
          </div>
        </Alert>
      )}

      {/* Carousel Preview */}
      {uploadItems.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preview Files</CardTitle>
                <CardDescription>
                  {currentIndex + 1} of {uploadItems.length} files
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={prevItem}
                  disabled={currentIndex === 0}
                  variant="outline"
                  size="icon"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  onClick={nextItem}
                  disabled={currentIndex === uploadItems.length - 1}
                  variant="outline"
                  size="icon"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Preview */}
              <div className="lg:col-span-2">
                <div className="border-2 border-border rounded-xl p-4 h-[400px] flex items-center justify-center bg-muted/30">
                  {currentItem.previewUrl ? (
                    <img
                      src={currentItem.previewUrl}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center space-y-3">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">No preview available</p>
                    </div>
                  )}
                </div>
                
                {/* File Info */}
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">File Information</h4>
                        {currentItem.uploading && (
                          <Badge variant="secondary" className="animate-pulse">
                            Uploading...
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Filename</p>
                          <p className="font-medium truncate">{currentItem.file?.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="font-medium">
                            {(currentItem.file?.size || 0) / 1024 / 1024 > 1 
                              ? `${((currentItem.file?.size || 0) / 1024 / 1024).toFixed(2)} MB`
                              : `${((currentItem.file?.size || 0) / 1024).toFixed(2)} KB`
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {currentItem.error && (
                      <Alert variant="destructive" className="mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{currentItem.error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Thumbnail Grid */}
              <div>
                <h4 className="font-medium text-foreground mb-3">All Files</h4>
                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-1">
                  {uploadItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`relative border-2 rounded-lg cursor-pointer transition-all ${
                        index === currentIndex 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <div className="aspect-square bg-muted/20 rounded flex items-center justify-center p-2">
                        <img
                          src={item.previewUrl}
                          alt={`Thumbnail ${index + 1}`}
                          className="max-h-full max-w-full object-contain rounded"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-sm flex items-center justify-center hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {item.uploading && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      {item.error && (
                        <div className="absolute bottom-1 right-1">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Global Error */}
      {globalError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}

      {/* Upload Button */}
      {uploadItems.length > 0 && (
        <div className="space-y-4">
          <Button
            type="button"
            onClick={handleBulkUpload}
            disabled={loading}
            size="lg"
            className="w-full h-14 text-lg font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading {uploadItems.length} Files...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Upload className="h-5 w-5" />
                <span>Upload All {uploadItems.length} Files</span>
              </div>
            )}
          </Button>
          
          {loading && (
            <div className="space-y-2">
              <Progress value={(successCount / uploadItems.length) * 100} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                {successCount} of {uploadItems.length} files processed
              </p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-primary">1</span>
              </div>
              <span className="text-muted-foreground">Ensure name, phone number, and address on the package are clearly visible</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-primary">2</span>
              </div>
              <span className="text-muted-foreground">Text extraction (name, phone, address, etc.) happens automatically during upload</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <span className="text-muted-foreground">Contact developer if you encounter any issues during upload</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}