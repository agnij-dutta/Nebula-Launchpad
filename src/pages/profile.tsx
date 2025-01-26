import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import Layout from '@/components/Layout';
import { USER_PROFILE_ADDRESS, USER_PROFILE_ABI } from '@/config/contracts';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ProfilePage = () => {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { address } = useAccount();

  const { data: profile } = useContractRead({
    address: USER_PROFILE_ADDRESS,
    abi: USER_PROFILE_ABI,
    functionName: 'getProfile',
    args: [address],
    watch: true,
  });

  const { write: updateProfile, data: updateData } = useContractWrite({
    address: USER_PROFILE_ADDRESS,
    abi: USER_PROFILE_ABI,
    functionName: 'updateProfile',
  });

  const { isLoading: isUpdating } = useWaitForTransaction({
    hash: updateData?.hash,
  });

  useEffect(() => {
    setMounted(true);
    if (profile) {
      const [profileName, profileEmail, profileAvatar] = profile;
      setName(profileName);
      setEmail(profileEmail);
      setAvatar(profileAvatar);
    }
  }, [profile]);

  if (!mounted) return null;

  const handleUpdateProfile = async () => {
    try {
      await updateProfile?.({
        args: [name, email, avatar],
      });
      toast.success('Profile update initiated...');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">Your Profile</h1>
            <p className="text-text-secondary">Manage your research profile</p>
          </div>

          <div className="glass-panel">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Profile Information</h2>
              {!isEditing && (
                <button
                  className="gradient-button-sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary">
                      No Avatar
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="input-field"
                      placeholder="Enter avatar URL"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-white">{name || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                ) : (
                  <p className="text-white">{email || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Wallet Address
                </label>
                <p className="text-white font-mono text-sm">{address}</p>
              </div>

              {isEditing && (
                <div className="flex space-x-4">
                  <button
                    className="gradient-button flex-1"
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </button>
                  <button
                    className="outline-button flex-1"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(ProfilePage), {
  ssr: false
});
