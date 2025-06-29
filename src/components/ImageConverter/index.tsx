'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, Download, X } from 'lucide-react';

interface ConvertedImage {
  name: string;
  originalSize: number;
  convertedSize: number;
  url: string;
  file: File;
}

export default function ImageConverter() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [converting, setConverting] = useState(false);
  const [quality, setQuality] = useState<string>('0.9');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const qualityPresets = {
    '0.9': { label: '高品質 (90%)', value: 0.9 },
    '0.75': { label: '中品質 (75%)', value: 0.75 },
    '0.5': { label: '低品質 (50%)', value: 0.5 }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/') && (file.type.includes('png') || file.type.includes('jpeg') || file.type.includes('jpg'))
    );
    
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file =>
        file.type.startsWith('image/') && (file.type.includes('png') || file.type.includes('jpeg') || file.type.includes('jpg'))
      );
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const convertToWebP = async (file: File): Promise<ConvertedImage> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const convertedFile = new File([blob], file.name.replace(/\.(png|jpe?g)$/i, '.webp'), {
              type: 'image/webp'
            });
            
            resolve({
              name: convertedFile.name,
              originalSize: file.size,
              convertedSize: blob.size,
              url: URL.createObjectURL(blob),
              file: convertedFile
            });
          }
        }, 'image/webp', qualityPresets[quality as keyof typeof qualityPresets].value);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setConverting(true);
    const converted: ConvertedImage[] = [];

    for (const file of files) {
      try {
        const convertedImage = await convertToWebP(file);
        converted.push(convertedImage);
      } catch (error) {
        console.error('変換エラー:', error);
      }
    }

    setConvertedImages(converted);
    setConverting(false);
  };

  const downloadImage = (convertedImage: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = convertedImage.url;
    link.download = convertedImage.name;
    link.click();
  };

  const downloadAll = () => {
    convertedImages.forEach(img => downloadImage(img));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setConvertedImages([]);
    convertedImages.forEach(img => URL.revokeObjectURL(img.url));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (original: number, converted: number) => {
    const ratio = ((original - converted) / original) * 100;
    return ratio > 0 ? `-${ratio.toFixed(1)}%` : `+${Math.abs(ratio).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="quality">品質プリセット</Label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(qualityPresets).map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg mb-2">画像をドラッグ&ドロップまたはクリックして選択</p>
        <p className="text-sm text-muted-foreground mb-4">
          PNG、JPG、JPEG形式に対応
        </p>
        <Button onClick={() => fileInputRef.current?.click()}>
          ファイルを選択
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">選択された画像 ({files.length}件)</h3>
            <div className="flex gap-2">
              <Button onClick={handleConvert} disabled={converting}>
                {converting ? '変換中...' : 'WebPに変換'}
              </Button>
              <Button variant="outline" onClick={clearAll}>
                クリア
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {convertedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">変換結果 ({convertedImages.length}件)</h3>
              <p className="text-sm text-muted-foreground">
                品質: {qualityPresets[quality as keyof typeof qualityPresets].label}
              </p>
            </div>
            <Button onClick={downloadAll}>
              <Download className="h-4 w-4 mr-2" />
              すべてダウンロード
            </Button>
          </div>

          <div className="grid gap-2">
            {convertedImages.map((img, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{img.name}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{formatFileSize(img.originalSize)} → {formatFileSize(img.convertedSize)}</span>
                    <span className={`font-medium ${
                      img.convertedSize < img.originalSize ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {getCompressionRatio(img.originalSize, img.convertedSize)}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => downloadImage(img)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  ダウンロード
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}