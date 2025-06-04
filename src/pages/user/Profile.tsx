import React, { useState, useEffect, useRef } from 'react';
import { Camera, User, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string | null;
  dateOfBirth: string;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      profilePicture: user?.profilePicture || null,
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setShowImagePreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<string> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width!;
    canvas.height = crop.height!;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width!,
      crop.height!
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      }, 'image/jpeg');
    });
  };

  const handleSaveImage = async () => {
    if (imageRef.current && previewImage) {
      try {
        const croppedImageUrl = await getCroppedImg(imageRef.current, crop);
        
        // Update profile picture in editedProfile
        setEditedProfile(prev => ({
          ...prev,
          profilePicture: croppedImageUrl
        }));

        // Update in localStorage
        const storedUsers = localStorage.getItem('users');
        const storedMarketers = localStorage.getItem('marketers');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        const marketers = storedMarketers ? JSON.parse(storedMarketers) : [];

        const userList = user?.role === 'marketer' ? marketers : users;
        const userIndex = userList.findIndex((u: any) => u.id === user?.id);

        if (userIndex !== -1) {
          userList[userIndex].profilePicture = croppedImageUrl;
          if (user?.role === 'marketer') {
            localStorage.setItem('marketers', JSON.stringify(marketers));
          } else {
            localStorage.setItem('users', JSON.stringify(users));
          }

          // Update the user in AuthContext
          const updatedUser = {
            ...user!,
            profilePicture: croppedImageUrl
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        setShowImagePreview(false);
        setPreviewImage(null);
        toast.success('Profile picture updated successfully');
      } catch (error) {
        toast.error('Failed to update profile picture');
        console.error('Error updating profile picture:', error);
      }
    }
  };

  const validatePhoneNumber = (number: string) => {
    // Indian phone number format: +91 XXXXX XXXXX
    const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
    return phoneRegex.test(number.replace(/[\s-]/g, ''));
  };

  const formatPhoneNumber = (number: string) => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // Format as +91 XXXXX XXXXX
    if (cleaned.length >= 10) {
      const last10Digits = cleaned.slice(-10);
      return `+91 ${last10Digits.slice(0, 5)} ${last10Digits.slice(5)}`;
    }
    return number;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    setEditedProfile(prev => ({
      ...prev,
      phoneNumber: formattedValue
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number
    if (editedProfile.phoneNumber && !validatePhoneNumber(editedProfile.phoneNumber)) {
      toast.error('Please enter a valid Indian phone number');
      return;
    }

    // Format phone number before saving
    const formattedProfile = {
      ...editedProfile,
      phoneNumber: editedProfile.phoneNumber ? formatPhoneNumber(editedProfile.phoneNumber) : ''
    };

    setProfile(formattedProfile);

    // Update user data in localStorage
    const storedUsers = localStorage.getItem('users');
    const storedMarketers = localStorage.getItem('marketers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const marketers = storedMarketers ? JSON.parse(storedMarketers) : [];

    const userList = user?.role === 'marketer' ? marketers : users;
    const userIndex = userList.findIndex((u: any) => u.id === user?.id);

    if (userIndex !== -1) {
      userList[userIndex] = {
        ...userList[userIndex],
        ...formattedProfile
      };

      if (user?.role === 'marketer') {
        localStorage.setItem('marketers', JSON.stringify(marketers));
      } else {
        localStorage.setItem('users', JSON.stringify(users));
      }

      // Update the user in AuthContext
      const updatedUser = {
        ...user!,
        ...formattedProfile
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
      toast.success('Password updated successfully');
      setShowChangePassword(false);
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information Card */}
        <div className="lg:col-span-2">
          <Card className="bg-white/5 backdrop-blur-sm border-t-2 border-t-purple-500 border-x-0 border-b-0 rounded-lg overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <CardTitle className="text-white/90">Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="mt-6">
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center overflow-hidden">
                    {editedProfile.profilePicture ? (
                      <img
                        src={editedProfile.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 p-1.5 bg-purple-500/20 text-purple-400 rounded-full cursor-pointer hover:bg-purple-500/30 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <div>
                  <p className="text-white/90 text-lg">{user?.role || 'user'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm text-white/60">First Name</label>
                  <Input
                    type="text"
                    value={editedProfile.firstName}
                    onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                    disabled={!isEditing}
                    placeholder="John"
                    className="bg-white/5 border-0 text-white/90 placeholder-white/20 focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Last Name</label>
                  <Input
                    type="text"
                    value={editedProfile.lastName}
                    onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Doe"
                    className="bg-white/5 border-0 text-white/90 placeholder-white/20 focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Email</label>
                  <Input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    disabled={!isEditing}
                    placeholder="user@taskmanagement.com"
                    className="bg-white/5 border-0 text-white/90 placeholder-white/20 focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Phone Number</label>
                  <Input
                    type="tel"
                    value={editedProfile.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    disabled={!isEditing}
                    placeholder="+91 98765 43210"
                    className="bg-white/5 border-0 text-white/90 placeholder-white/20 focus:ring-2 focus:ring-purple-500/30"
                    pattern="^(\+91[\s-]?)?[6-9]\d{9}$"
                    title="Please enter a valid Indian phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/60">Date of Birth</label>
                  <Input
                    type="date"
                    value={editedProfile.dateOfBirth}
                    onChange={(e) => setEditedProfile({ ...editedProfile, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    className="bg-white/5 border-0 text-white/90 placeholder-white/20 focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProfile(profile);
                      }}
                      className="mr-4 bg-white/5 text-white/60 hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Security Card */}
        <div>
          <Card className="bg-white/5 backdrop-blur-sm border-t-2 border-t-blue-500 border-x-0 border-b-0 rounded-lg overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <CardTitle className="text-white/90">Account Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="mt-6 space-y-6">
              <div>
                <h3 className="text-white/90 mb-1">Two-Factor Authentication</h3>
                <p className="text-white/60 text-sm mb-3">Protect your account with an extra layer of security</p>
                <Button className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                  Enable 2FA
                </Button>
              </div>

              <div>
                <h3 className="text-white/90 mb-1">Password</h3>
                <p className="text-white/60 text-sm mb-3">Last changed 3 months ago</p>
                <Button 
                  onClick={() => setShowChangePassword(true)}
                  className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                >
                  Change Password
                </Button>
              </div>

              <div>
                <h3 className="text-white/90 mb-1">Sessions</h3>
                <p className="text-white/60 text-sm mb-3">Manage your active sessions</p>
                <Button className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                  View Active Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && previewImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1C1F26] rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Adjust Profile Picture</h2>
            <div className="relative w-full max-h-[60vh] overflow-auto mb-6">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imageRef}
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full"
                />
              </ReactCrop>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowImagePreview(false);
                  setPreviewImage(null);
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveImage}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1C1F26] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-white mb-6">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-lg text-gray-200 mb-2">Current Password</label>
                <div className="relative">
                  <Input
                    type={showOldPassword ? 'text' : 'password'}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full h-12 bg-[#2A2F3B] border-0 text-white rounded-md focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-lg text-gray-200 mb-2">New Password</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full h-12 bg-[#2A2F3B] border-0 text-white rounded-md focus:ring-2 focus:ring-purple-500"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-lg text-gray-200 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full h-12 bg-[#2A2F3B] border-0 text-white rounded-md focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordForm({
                      oldPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="px-6 py-3 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors font-medium text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#312E81] text-white rounded-lg hover:bg-[#3730A3] transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;