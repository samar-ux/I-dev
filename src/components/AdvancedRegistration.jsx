import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Phone, Building, Upload, 
  CreditCard, Wallet, FileText, MapPin, Calendar,
  Truck, Store, UserCircle, Shield, Award, IdCard, Car
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import DocumentUploadCard from "./DocumentUploadCard";

const AdvancedRegistration = ({ userType, onBack, onComplete }) => {
  const [registrationType, setRegistrationType] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // بيانات أساسية
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nationalId: "",
      dateOfBirth: "",
      gender: ""
    },
    // العنوان
    address: {
      country: "السعودية",
      city: "",
      district: "",
      street: "",
      buildingNumber: "",
      postalCode: ""
    },
    // بيانات النشاط التجاري
    businessInfo: {
      businessName: "",
      businessType: "",
      commercialRegistry: "",
      taxNumber: "",
      businessLicense: "",
      establishmentDate: "",
      businessAddress: "",
      businessPhone: "",
      businessEmail: ""
    },
    // بيانات السائق
    driverInfo: {
      licenseNumber: "",
      licenseExpiry: "",
      vehicleType: "",
      vehiclePlate: "",
      vehicleModel: "",
      vehicleYear: "",
      insuranceNumber: "",
      insuranceExpiry: ""
    },
    // بيانات الشركة
    companyInfo: {
      companyName: "",
      companyType: "",
      registrationNumber: "",
      establishmentDate: "",
      employeeCount: "",
      fleetSize: "",
      servicesOffered: "",
      operatingCities: ""
    },
    // المحفظة الإلكترونية
    walletInfo: {
      walletAddress: "",
      walletType: "",
      publicKey: ""
    },
    // كلمة المرور والأمان
    security: {
      password: "",
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: ""
    }
  });

  const [uploadedFiles, setUploadedFiles] = useState({});

  // أنواع التسجيل
  const registrationTypes = [
    {
      id: "standard",
      title: "تسجيل عادي",
      description: "تسجيل بالبريد الإلكتروني ورقم الهاتف",
      icon: Mail,
      color: "bg-blue-500",
      features: ["سهل وسريع", "تحقق بالرسائل النصية", "إعداد فوري"]
    },
    {
      id: "business_id",
      title: "هوية تجارية",
      description: "تسجيل بالهوية التجارية أو السجل التجاري",
      icon: IdCard,
      color: "bg-green-500", 
      features: ["مصداقية عالية", "للأنشطة التجارية", "تحقق متقدم"]
    },
    {
      id: "wallet",
      title: "محفظة إلكترونية",
      description: "تسجيل باستخدام المحفظة الرقمية",
      icon: Wallet,
      color: "bg-purple-500",
      features: ["Web3 متقدم", "أمان فائق", "معاملات مشفرة"]
    }
  ];

  // المراحل حسب نوع المستخدم
  const getStepsForUserType = () => {
    const baseSteps = [
      { id: 1, title: "نوع التسجيل", icon: Shield },
      { id: 2, title: "البيانات الشخصية", icon: User },
      { id: 3, title: "العنوان", icon: MapPin },
    ];

    switch (userType) {
      case "store_owner":
        return [
          ...baseSteps,
          { id: 4, title: "بيانات المتجر", icon: Store },
          { id: 5, title: "المستندات", icon: FileText },
          { id: 6, title: "الأمان", icon: Shield }
        ];
      case "driver":
        return [
          ...baseSteps,
          { id: 4, title: "رخصة القيادة", icon: IdCard },
          { id: 5, title: "بيانات المركبة", icon: Car },
          { id: 6, title: "المستندات", icon: FileText },
          { id: 7, title: "الأمان", icon: Shield }
        ];
      case "company":
        return [
          ...baseSteps,
          { id: 4, title: "بيانات الشركة", icon: Building },
          { id: 5, title: "التراخيص", icon: Award },
          { id: 6, title: "المستندات", icon: FileText },
          { id: 7, title: "الأمان", icon: Shield }
        ];
      default: // customer
        return [
          ...baseSteps,
          { id: 4, title: "الأمان", icon: Shield }
        ];
    }
  };

  const steps = getStepsForUserType();

  const getUserTypeInfo = () => {
    switch (userType) {
      case "customer":
        return { title: "تسجيل عميل", icon: UserCircle, color: "text-blue-600" };
      case "store_owner":
        return { title: "تسجيل صاحب متجر", icon: Store, color: "text-green-600" };
      case "driver":
        return { title: "تسجيل سائق", icon: Truck, color: "text-orange-600" };
      case "company":
        return { title: "تسجيل شركة", icon: Building, color: "text-purple-600" };
      default:
        return { title: "تسجيل مستخدم", icon: User, color: "text-gray-600" };
    }
  };

  const userTypeInfo = getUserTypeInfo();

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (fieldName, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
          handleInputChange('walletInfo', 'walletAddress', accounts[0]);
          handleInputChange('walletInfo', 'walletType', 'MetaMask');
          setRegistrationType('wallet');
        }
      } else {
        alert('يرجى تثبيت محفظة MetaMask أولاً');
      }
    } catch (error) {
      console.error('خطأ في الاتصال بالمحفظة:', error);
    }
  };

  const renderStepContent = () => {
    const currentStepData = steps.find(step => step.id === currentStep);
    
    switch (currentStepData?.title) {
      case "نوع التسجيل":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">اختر طريقة التسجيل</h3>
              <p className="text-gray-600">اختر الطريقة الأنسب لك للتسجيل في المنصة</p>
            </div>
            
            <div className="grid gap-4">
              {registrationTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = registrationType === type.id;
                
                return (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? "border-2 border-primary shadow-lg bg-primary/5" 
                          : "hover:shadow-md border border-gray-200"
                      }`}
                      onClick={() => setRegistrationType(type.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full ${type.color} text-white`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-800 mb-1">{type.title}</h4>
                            <p className="text-gray-600 mb-3">{type.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {type.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="text-primary">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* خيارات خاصة للمحفظة الإلكترونية */}
                        {type.id === "wallet" && isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 pt-4 border-t border-gray-200"
                          >
                            <Button
                              onClick={connectWallet}
                              className="w-full bg-orange-500 hover:bg-orange-600"
                            >
                              <Wallet className="w-4 h-4 mr-2" />
                              الاتصال بـ MetaMask
                            </Button>
                            {formData.walletInfo.walletAddress && (
                              <div className="mt-2 p-2 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-700">
                                  تم الاتصال: {formData.walletInfo.walletAddress.slice(0, 6)}...{formData.walletInfo.walletAddress.slice(-4)}
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      case "البيانات الشخصية":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">البيانات الشخصية</h3>
              <p className="text-gray-600">أدخل معلوماتك الشخصية الأساسية</p>
            </div>
            
            {/* الصورة الشخصية */}
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <Label className="text-base font-medium mb-4 block">الصورة الشخصية</Label>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="w-full h-full rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {uploadedFiles.profileImage ? (
                      <img
                        src={URL.createObjectURL(uploadedFiles.profileImage)}
                        alt="الصورة الشخصية"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleFileUpload('profileImage', e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">اضغط لرفع صورتك الشخصية</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  placeholder="أدخل اسمك الأول"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">اسم العائلة</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  placeholder="أدخل اسم العائلة"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    placeholder="example@domain.com"
                    className="pr-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    placeholder="+966xxxxxxxxx"
                    className="pr-10 text-right"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationalId">رقم الهوية الوطنية</Label>
                <Input
                  id="nationalId"
                  value={formData.personalInfo.nationalId}
                  onChange={(e) => handleInputChange('personalInfo', 'nationalId', e.target.value)}
                  placeholder="1xxxxxxxxx"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">تاريخ الميلاد</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="gender">الجنس</Label>
                <Select
                  value={formData.personalInfo.gender}
                  onValueChange={(value) => handleInputChange('personalInfo', 'gender', value)}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "العنوان":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">عنوان السكن</h3>
              <p className="text-gray-600">أدخل عنوانك بالتفصيل للتوصيل الدقيق</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">الدولة</Label>
                <Select
                  value={formData.address.country}
                  onValueChange={(value) => handleInputChange('address', 'country', value)}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="السعودية">المملكة العربية السعودية</SelectItem>
                    <SelectItem value="الإمارات">دولة الإمارات العربية المتحدة</SelectItem>
                    <SelectItem value="الكويت">دولة الكويت</SelectItem>
                    <SelectItem value="قطر">دولة قطر</SelectItem>
                    <SelectItem value="البحرين">مملكة البحرين</SelectItem>
                    <SelectItem value="عمان">سلطنة عمان</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                  placeholder="مثل: الرياض، جدة، الدمام"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="district">الحي</Label>
                <Input
                  id="district"
                  value={formData.address.district}
                  onChange={(e) => handleInputChange('address', 'district', e.target.value)}
                  placeholder="اسم الحي"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="street">الشارع</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                  placeholder="اسم الشارع"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buildingNumber">رقم المبنى</Label>
                <Input
                  id="buildingNumber"
                  value={formData.address.buildingNumber}
                  onChange={(e) => handleInputChange('address', 'buildingNumber', e.target.value)}
                  placeholder="رقم المبنى"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">الرمز البريدي</Label>
                <Input
                  id="postalCode"
                  value={formData.address.postalCode}
                  onChange={(e) => handleInputChange('address', 'postalCode', e.target.value)}
                  placeholder="12345"
                  className="text-right"
                />
              </div>
            </div>
          </div>
        );

      case "بيانات المتجر":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">معلومات المتجر</h3>
              <p className="text-gray-600">أدخل بيانات متجرك ونشاطك التجاري</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">اسم المتجر</Label>
                <Input
                  id="businessName"
                  value={formData.businessInfo.businessName}
                  onChange={(e) => handleInputChange('businessInfo', 'businessName', e.target.value)}
                  placeholder="اسم متجرك التجاري"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessType">نوع النشاط التجاري</Label>
                <Select
                  value={formData.businessInfo.businessType}
                  onValueChange={(value) => handleInputChange('businessInfo', 'businessType', value)}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر نوع النشاط" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">تجارة تجزئة</SelectItem>
                    <SelectItem value="wholesale">تجارة جملة</SelectItem>
                    <SelectItem value="electronics">إلكترونيات</SelectItem>
                    <SelectItem value="fashion">أزياء وملابس</SelectItem>
                    <SelectItem value="food">مواد غذائية</SelectItem>
                    <SelectItem value="books">كتب ومكتبات</SelectItem>
                    <SelectItem value="home">منزل وحديقة</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commercialRegistry">رقم السجل التجاري</Label>
                <Input
                  id="commercialRegistry"
                  value={formData.businessInfo.commercialRegistry}
                  onChange={(e) => handleInputChange('businessInfo', 'commercialRegistry', e.target.value)}
                  placeholder="1010xxxxxx"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                <Input
                  id="taxNumber"
                  value={formData.businessInfo.taxNumber}
                  onChange={(e) => handleInputChange('businessInfo', 'taxNumber', e.target.value)}
                  placeholder="3xxxxxxxxxxxxx"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="establishmentDate">تاريخ تأسيس المتجر</Label>
                <Input
                  id="establishmentDate"
                  type="date"
                  value={formData.businessInfo.establishmentDate}
                  onChange={(e) => handleInputChange('businessInfo', 'establishmentDate', e.target.value)}
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessPhone">هاتف المتجر</Label>
                <Input
                  id="businessPhone"
                  value={formData.businessInfo.businessPhone}
                  onChange={(e) => handleInputChange('businessInfo', 'businessPhone', e.target.value)}
                  placeholder="+966xxxxxxxxx"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="businessAddress">عنوان المتجر</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessInfo.businessAddress}
                  onChange={(e) => handleInputChange('businessInfo', 'businessAddress', e.target.value)}
                  placeholder="العنوان التفصيلي للمتجر"
                  className="text-right"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case "رخصة القيادة":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">رخصة القيادة</h3>
              <p className="text-gray-600">أدخل بيانات رخصة القيادة الخاصة بك</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">رقم رخصة القيادة</Label>
                <Input
                  id="licenseNumber"
                  value={formData.driverInfo.licenseNumber}
                  onChange={(e) => handleInputChange('driverInfo', 'licenseNumber', e.target.value)}
                  placeholder="رقم الرخصة"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">تاريخ انتهاء الرخصة</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.driverInfo.licenseExpiry}
                  onChange={(e) => handleInputChange('driverInfo', 'licenseExpiry', e.target.value)}
                  className="text-right"
                />
              </div>
            </div>
          </div>
        );

      case "بيانات المركبة":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">معلومات المركبة</h3>
              <p className="text-gray-600">أدخل بيانات المركبة المستخدمة في التوصيل</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">نوع المركبة</Label>
                <Select
                  value={formData.driverInfo.vehicleType}
                  onValueChange={(value) => handleInputChange('driverInfo', 'vehicleType', value)}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر نوع المركبة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">سيارة</SelectItem>
                    <SelectItem value="van">فان</SelectItem>
                    <SelectItem value="truck">شاحنة صغيرة</SelectItem>
                    <SelectItem value="motorcycle">دراجة نارية</SelectItem>
                    <SelectItem value="bicycle">دراجة هوائية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehiclePlate">رقم اللوحة</Label>
                <Input
                  id="vehiclePlate"
                  value={formData.driverInfo.vehiclePlate}
                  onChange={(e) => handleInputChange('driverInfo', 'vehiclePlate', e.target.value)}
                  placeholder="أ ب ج 1234"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">طراز المركبة</Label>
                <Input
                  id="vehicleModel"
                  value={formData.driverInfo.vehicleModel}
                  onChange={(e) => handleInputChange('driverInfo', 'vehicleModel', e.target.value)}
                  placeholder="مثل: تويوتا كامري"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicleYear">سنة الصنع</Label>
                <Input
                  id="vehicleYear"
                  type="number"
                  value={formData.driverInfo.vehicleYear}
                  onChange={(e) => handleInputChange('driverInfo', 'vehicleYear', e.target.value)}
                  placeholder="2020"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceNumber">رقم التأمين</Label>
                <Input
                  id="insuranceNumber"
                  value={formData.driverInfo.insuranceNumber}
                  onChange={(e) => handleInputChange('driverInfo', 'insuranceNumber', e.target.value)}
                  placeholder="رقم بوليصة التأمين"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceExpiry">تاريخ انتهاء التأمين</Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  value={formData.driverInfo.insuranceExpiry}
                  onChange={(e) => handleInputChange('driverInfo', 'insuranceExpiry', e.target.value)}
                  className="text-right"
                />
              </div>
            </div>
          </div>
        );

      case "بيانات الشركة":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">معلومات الشركة</h3>
              <p className="text-gray-600">أدخل بيانات شركتك التفصيلية</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">اسم الشركة</Label>
                <Input
                  id="companyName"
                  value={formData.companyInfo.companyName}
                  onChange={(e) => handleInputChange('companyInfo', 'companyName', e.target.value)}
                  placeholder="اسم الشركة الرسمي"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyType">نوع الشركة</Label>
                <Select
                  value={formData.companyInfo.companyType}
                  onValueChange={(value) => handleInputChange('companyInfo', 'companyType', value)}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر نوع الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logistics">شركة لوجستيات</SelectItem>
                    <SelectItem value="delivery">شركة توصيل</SelectItem>
                    <SelectItem value="transport">شركة نقل</SelectItem>
                    <SelectItem value="shipping">شركة شحن</SelectItem>
                    <SelectItem value="courier">شركة البريد السريع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">رقم السجل التجاري</Label>
                <Input
                  id="registrationNumber"
                  value={formData.companyInfo.registrationNumber}
                  onChange={(e) => handleInputChange('companyInfo', 'registrationNumber', e.target.value)}
                  placeholder="رقم السجل التجاري"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employeeCount">عدد الموظفين</Label>
                <Select
                  value={formData.companyInfo.employeeCount}
                  onValueChange={(value) => handleInputChange('companyInfo', 'employeeCount', value)}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر عدد الموظفين" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 موظفين</SelectItem>
                    <SelectItem value="11-50">11-50 موظف</SelectItem>
                    <SelectItem value="51-100">51-100 موظف</SelectItem>
                    <SelectItem value="100+">أكثر من 100 موظف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fleetSize">حجم الأسطول</Label>
                <Input
                  id="fleetSize"
                  type="number"
                  value={formData.companyInfo.fleetSize}
                  onChange={(e) => handleInputChange('companyInfo', 'fleetSize', e.target.value)}
                  placeholder="عدد المركبات"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operatingCities">المدن العاملة</Label>
                <Input
                  id="operatingCities"
                  value={formData.companyInfo.operatingCities}
                  onChange={(e) => handleInputChange('companyInfo', 'operatingCities', e.target.value)}
                  placeholder="الرياض، جدة، الدمام..."
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="servicesOffered">الخدمات المقدمة</Label>
                <Textarea
                  id="servicesOffered"
                  value={formData.companyInfo.servicesOffered}
                  onChange={(e) => handleInputChange('companyInfo', 'servicesOffered', e.target.value)}
                  placeholder="اوصف الخدمات التي تقدمها شركتك"
                  className="text-right"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case "المستندات":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">رفع المستندات</h3>
              <p className="text-gray-600">قم برفع المستندات المطلوبة للتحقق من الهوية</p>
            </div>
            
            <div className="grid gap-4">
              {/* مستندات مشتركة */}
              <DocumentUploadCard
                title="صورة الهوية الوطنية"
                description="صورة واضحة من الجهتين"
                fieldName="nationalIdDocument"
                required={true}
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFiles.nationalIdDocument}
              />
              
              {/* مستندات حسب نوع المستخدم */}
              {userType === "store_owner" && (
                <>
                  <DocumentUploadCard
                    title="السجل التجاري"
                    description="صورة من السجل التجاري ساري المفعول"
                    fieldName="commercialRegistryDocument"
                    required={true}
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFiles.commercialRegistryDocument}
                  />
                  <DocumentUploadCard
                    title="الرقم الضريبي"
                    description="شهادة التسجيل في ضريبة القيمة المضافة"
                    fieldName="taxCertificate"
                    required={false}
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFiles.taxCertificate}
                  />
                </>
              )}
              
              {userType === "driver" && (
                <>
                  <DocumentUploadCard
                    title="رخصة القيادة"
                    description="صورة من رخصة القيادة سارية المفعول"
                    fieldName="drivingLicense"
                    required={true}
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFiles.drivingLicense}
                  />
                  <DocumentUploadCard
                    title="تأمين المركبة"
                    description="بوليصة تأمين المركبة"
                    fieldName="vehicleInsurance"
                    required={true}
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFiles.vehicleInsurance}
                  />
                  <DocumentUploadCard
                    title="استمارة المركبة"
                    description="استمارة السيارة أو الدراجة"
                    fieldName="vehicleRegistration"
                    required={true}
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFiles.vehicleRegistration}
                  />
                </>
              )}
              
              {userType === "company" && (
                <>
                  <DocumentUploadCard
                    title="السجل التجاري للشركة"
                    description="السجل التجاري ساري المفعول"
                    fieldName="companyRegistry"
                    required={true}
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFiles.companyRegistry}
                  />
                  <DocumentUploadCard
                    title="رخصة النقل"
                    description="رخصة مزاولة نشاط النقل"
                    fieldName="transportLicense"
                    required={true}
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFiles.transportLicense}
                  />
                </>
              )}
            </div>
          </div>
        );

      case "التراخيص":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">التراخيص والشهادات</h3>
              <p className="text-gray-600">قم برفع التراخيص والشهادات المطلوبة</p>
            </div>
            
            <div className="grid gap-4">
              <DocumentUploadCard
                title="رخصة مزاولة النشاط"
                description="رخصة من الجهات المختصة"
                fieldName="businessLicense"
                required={true}
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFiles.businessLicense}
              />
              
              <DocumentUploadCard
                title="شهادة الجودة"
                description="شهادات الجودة والمعايير"
                fieldName="qualityCertificate"
                required={false}
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFiles.qualityCertificate}
              />
            </div>
          </div>
        );

      case "الأمان":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">إعدادات الأمان</h3>
              <p className="text-gray-600">قم بإنشاء كلمة مرور قوية وإعدادات الأمان</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.security.password}
                  onChange={(e) => handleInputChange('security', 'password', e.target.value)}
                  placeholder="أدخل كلمة مرور قوية"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.security.confirmPassword}
                  onChange={(e) => handleInputChange('security', 'confirmPassword', e.target.value)}
                  placeholder="أعد إدخال كلمة المرور"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="securityQuestion">سؤال الأمان</Label>
                <Select
                  value={formData.security.securityQuestion}
                  onValueChange={(value) => handleInputChange('security', 'securityQuestion', value)}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر سؤال الأمان" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mother_name">ما اسم والدتك؟</SelectItem>
                    <SelectItem value="birth_city">ما مدينة ميلادك؟</SelectItem>
                    <SelectItem value="first_school">ما اسم مدرستك الأولى؟</SelectItem>
                    <SelectItem value="favorite_food">ما طعامك المفضل؟</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="securityAnswer">إجابة سؤال الأمان</Label>
                <Input
                  id="securityAnswer"
                  value={formData.security.securityAnswer}
                  onChange={(e) => handleInputChange('security', 'securityAnswer', e.target.value)}
                  placeholder="أدخل إجابة سؤال الأمان"
                  className="text-right"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">نصائح لكلمة مرور قوية:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• استخدم على الأقل 8 أحرف</li>
                <li>• امزج بين الأحرف الكبيرة والصغيرة</li>
                <li>• أضف أرقام ورموز خاصة</li>
                <li>• تجنب المعلومات الشخصية الواضحة</li>
              </ul>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">جاري تطوير هذه المرحلة...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="absolute right-4 top-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 backdrop-blur-lg border border-purple-400/40 hover:border-purple-400/60 text-gray-700 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 overflow-hidden group rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <span className="relative z-10">
                  رجوع
                </span>
              </Button>
              
              <userTypeInfo.icon className={`w-8 h-8 ${userTypeInfo.color}`} />
              <h1 className="text-2xl font-bold">{userTypeInfo.title}</h1>
            </div>
            
            {/* شريط التقدم */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive 
                          ? "bg-primary text-white" 
                          : isCompleted 
                            ? "bg-green-500 text-white" 
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>
            
            <p className="text-sm text-gray-600">
              المرحلة {currentStep} من {steps.length}: {steps.find(s => s.id === currentStep)?.title}
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* أزرار التنقل */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                السابق
              </Button>
              
              <Button
                onClick={currentStep === steps.length ? onComplete : nextStep}
                disabled={currentStep === 1 && !registrationType}
              >
                {currentStep === steps.length ? "إنهاء التسجيل" : "التالي"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdvancedRegistration;