/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/images/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Image } from '../../../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Upload, Trash2, User, Phone, MapPin, FileText, Tag, AlertCircle, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/images');
      const data = await response.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    try {
      const response = await fetch(`/api/admin/images?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setImages(images.filter(img => img._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredImages = images.filter(image => 
    image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.extractedData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.extractedData.phoneNumber?.includes(searchTerm) ||
    image.extractedData.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-10 w-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Images</h1>
          <p className="text-muted-foreground mt-1">
            {images.length} image{images.length !== 1 ? 's' : ''} total
            {searchTerm && filteredImages.length !== images.length && 
              ` • ${filteredImages.length} matching search`
            }
          </p>
        </div>
        <Button asChild>
          <a href="/admin/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload New
          </a>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, phone, address, tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image: any) => (
          <Card key={image._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image */}
            <div 
              className="relative h-48 bg-muted/30 cursor-pointer group"
              onClick={() => {
                setPreviewImage(image);
                setIsPreviewOpen(true);
              }}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-sm">
                {image.documentType || 'general'}
              </Badge>
            </div>

            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg line-clamp-1">{image.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-xs">
                {image.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-3">
              {/* Extracted Data */}
              <div className="space-y-2">
                {image.extractedData.name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">Name:</span>
                    <span className="truncate">{image.extractedData.name}</span>
                  </div>
                )}
                {image.extractedData.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">Phone:</span>
                    <span>{image.extractedData.phoneNumber}</span>
                  </div>
                )}
                {image.extractedData.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">Address:</span>
                    <span className="truncate">{image.extractedData.address}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {image.tags && image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {image.tags.map((tag: any, index: any) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>Uploaded {formatDate(image.createdAt)}</span>
                <span>{image.size ? `${(image.size / 1024 / 1024).toFixed(1)} MB` : 'N/A'}</span>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => handleDelete(image._id!)}
                disabled={deleteLoading === image._id}
              >
                {deleteLoading === image._id ? (
                  <>
                    <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? 'No matching images' : 'No images found'}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {searchTerm 
                ? 'Try adjusting your search terms or filters.'
                : 'Upload your first image to get started.'
              }
            </p>
            {!searchTerm && (
              <Button asChild>
                <a href="/admin/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          {previewImage && (
            <>
              <DialogHeader>
                <DialogTitle>{previewImage.title}</DialogTitle>
                <DialogDescription>
                  Uploaded {formatDate(previewImage.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden bg-muted/30">
                    <img
                      src={previewImage.url}
                      alt={previewImage.title}
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-2" />
                      View Full Size
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1"
                      onClick={() => {
                        handleDelete(previewImage._id!);
                        setIsPreviewOpen(false);
                      }}
                      disabled={deleteLoading === previewImage._id}
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Extracted Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {previewImage.extractedData.name && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Name</div>
                          <div className="font-medium">{previewImage.extractedData.name}</div>
                        </div>
                      )}
                      {previewImage.extractedData.phoneNumber && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Phone Number</div>
                          <div className="font-medium">{previewImage.extractedData.phoneNumber}</div>
                        </div>
                      )}
                      {previewImage.extractedData.address && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Address</div>
                          <div className="font-medium">{previewImage.extractedData.address}</div>
                        </div>
                      )}
                      {previewImage.extractedData.otherText && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Additional Text</div>
                          <div className="text-sm text-muted-foreground line-clamp-4">
                            {previewImage.extractedData.otherText}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Document Type</span>
                        <span className="font-medium capitalize">
                          {previewImage.documentType?.replace('_', ' ') || 'General'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File Size</span>
                        <span className="font-medium">
                          {previewImage.size 
                            ? `${(previewImage.size / 1024 / 1024).toFixed(2)} MB`
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Upload Date</span>
                        <span className="font-medium">{formatDate(previewImage.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {previewImage.tags && previewImage.tags.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Tags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {previewImage.tags.map((tag: any, index: any) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}