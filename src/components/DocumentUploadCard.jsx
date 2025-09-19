import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, File, Check, X, Eye } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const DocumentUploadCard = ({ 
  title, 
  description, 
  fieldName, 
  required = false, 
  onFileUpload, 
  uploadedFile,
  acceptedTypes = "image/*,.pdf"
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('يرجى رفع ملف من نوع JPG، PNG، أو PDF فقط');
      return;
    }

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الملف كبير جداً. يرجى رفع ملف أصغر من 5 ميجابايت');
      return;
    }

    setUploading(true);
    
    // محاكاة عملية الرفع
    setTimeout(() => {
      onFileUpload(fieldName, {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        url: URL.createObjectURL(file) // للمعاينة فقط
      });
      setUploading(false);
    }, 1500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    onFileUpload(fieldName, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={`transition-all duration-200 ${uploadedFile ? 'border-green-300 bg-green-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              {title}
              {required && <Badge variant="destructive" className="text-xs">مطلوب</Badge>}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          {uploadedFile && (
            <div className="text-green-600">
              <Check className="w-5 h-5" />
            </div>
          )}
        </div>

        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
              dragOver 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {uploading ? (
              <div className="space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-600">جاري رفع الملف...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    اسحب الملف هنا أو انقر للاختيار
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG، PNG، PDF - حد أقصى 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-green-300 rounded-lg p-3 bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <File className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 truncate max-w-48">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {uploadedFile.type.startsWith('image/') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(uploadedFile.url, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploadCard;