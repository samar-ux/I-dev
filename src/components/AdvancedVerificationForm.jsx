import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, Clock, Globe, Shield, Key, Lock } from 'lucide-react';
import worldIdService from '../services/worldIdService';
import internetIdentityService from '../services/internetIdentityService';
import kycAmlService from '../services/kycAmlService';

const AdvancedVerificationForm = ({ userType, formData, onComplete, onBack }) => {
  const { t } = useTranslation();
  const [verificationStatus, setVerificationStatus] = useState({
    worldId: 'pending',
    mfa: 'pending',
    kycAml: 'pending',
    icp: 'pending'
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [completedVerifications, setCompletedVerifications] = useState(0);

  const verificationSteps = [
    {
      id: 'worldId',
      icon: Globe,
      title: 'World ID',
      description: t('world_id_integration'),
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'mfa',
      icon: Key,
      title: 'MFA',
      description: t('multi_factor_auth'),
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      id: 'kycAml',
      icon: Shield,
      title: 'KYC/AML',
      description: t('kyc_aml_operations'),
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      id: 'icp',
      icon: Lock,
      title: 'ICP',
      description: t('internet_identity_integration'),
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  const handleVerification = async (stepId) => {
    if (verificationStatus[stepId] !== 'pending') return;

    setIsVerifying(true);
    setVerificationStatus(prev => ({ ...prev, [stepId]: 'verifying' }));

    try {
      let result = null;

      switch (stepId) {
        case 'worldId':
          result = await worldIdService.verifyWithWorldId('register');
          break;
        case 'mfa':
          // محاكاة MFA
          await new Promise(resolve => setTimeout(resolve, 2000));
          result = { success: true, message: 'MFA verification completed' };
          break;
        case 'kycAml':
          result = await kycAmlService.performKycVerification({
            personalInfo: {
              firstName: formData.name?.split(' ')[0] || '',
              lastName: formData.name?.split(' ').slice(1).join(' ') || '',
              email: formData.email,
              phone: formData.phone
            }
          });
          break;
        case 'icp':
          result = await internetIdentityService.authenticateWithInternetIdentity();
          break;
        default:
          throw new Error('Unknown verification step');
      }

      if (result && result.success) {
        setVerificationStatus(prev => ({ ...prev, [stepId]: 'completed' }));
        setCompletedVerifications(prev => prev + 1);
      } else {
        setVerificationStatus(prev => ({ ...prev, [stepId]: 'failed' }));
      }
    } catch (error) {
      console.error(`Verification failed for ${stepId}:`, error);
      setVerificationStatus(prev => ({ ...prev, [stepId]: 'failed' }));
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'verifying':
        return <Clock className="w-6 h-6 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return t('verification_complete');
      case 'failed':
        return t('verification_failed');
      case 'verifying':
        return t('verification_pending');
      default:
        return t('click_to_verify');
    }
  };

  const handleCompleteRegistration = () => {
    if (completedVerifications >= 2) { // نجاح العملية إذا تم التحقق من خدمتين على الأقل
      onComplete({
        userType,
        verificationLevel: 'advanced',
        name: formData.name,
        email: formData.email,
        verificationStatus: verificationStatus
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <Card className="bg-white/10 backdrop-blur-lg shadow-2xl border-2 border-white/20 relative overflow-hidden">
          {/* Header */}
          <CardHeader className="text-center pb-6 relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CardTitle className="text-3xl font-bold text-white mb-2">
                {t('advanced_registration')}
              </CardTitle>
              <p className="text-lg text-white/80 mb-4">
                {t('choose_verification_level')}
              </p>
              
              {/* Progress */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">
                    {t('verification_progress')}: {completedVerifications}/4
                  </span>
                  <span className="text-white/70 text-sm">
                    {Math.round((completedVerifications / 4) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedVerifications / 4) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 relative z-10">
            {/* Verification Icons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {verificationSteps.map((step, index) => {
                const Icon = step.icon;
                const status = verificationStatus[step.id];
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className={`transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                        status === 'completed' ? 'bg-green-500/20 border-green-400' :
                        status === 'failed' ? 'bg-red-500/20 border-red-400' :
                        status === 'verifying' ? 'bg-yellow-500/20 border-yellow-400' :
                        'bg-white/10 border-white/20 hover:bg-white/20'
                      } backdrop-blur-lg border-2 overflow-hidden group`}
                      onClick={() => handleVerification(step.id)}
                    >
                      <CardContent className="p-6 text-center relative">
                        {/* Icon */}
                        <motion.div
                          whileHover={{ rotateY: 360 }}
                          transition={{ duration: 0.6 }}
                          className="relative z-10 mb-4"
                        >
                          <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </motion.div>
                        
                        {/* Status Icon */}
                        <div className="flex justify-center mb-2">
                          {getStatusIcon(status)}
                        </div>
                        
                        {/* Text */}
                        <div className="relative z-10">
                          <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                          <p className="text-white/70 text-xs mb-2">{step.description}</p>
                          <p className={`text-xs font-medium ${
                            status === 'completed' ? 'text-green-400' :
                            status === 'failed' ? 'text-red-400' :
                            status === 'verifying' ? 'text-yellow-400' :
                            'text-white/60'
                          }`}>
                            {getStatusText(status)}
                          </p>
                        </div>

                        {/* Effect */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <Button
                variant="outline"
                onClick={onBack}
                className="text-white border-white/30 hover:bg-white/10"
              >
                {t('choose_different_type')}
              </Button>
              
              <Button
                onClick={handleCompleteRegistration}
                disabled={completedVerifications < 2 || isVerifying}
                className={`bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  completedVerifications < 2 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {t('complete_registration')}
              </Button>
            </div>

            {/* Instructions */}
            <div className="text-center text-white/60 text-sm">
              <p>{t('verification_instructions')}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdvancedVerificationForm;
