import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      // Redirect based on user role
      switch (result.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'marketer':
          navigate('/marketer/dashboard');
          break;
        default:
          navigate('/user/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Container variants for orchestrating child animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  // Page opening animation variants
  const pageVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1.8,
        ease: [0.6, 0.01, -0.05, 0.95],
        delay: 0.5
      }
    }
  };

  // Logo animation variants
  const logoVariants = {
    hidden: { 
      scale: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 2,
        ease: [0.6, 0.01, -0.05, 0.95],
        delay: 1.2
      }
    }
  };

  // Text animation variants
  const textVariants = {
    hidden: { 
      y: 30,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={pageVariants}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <motion.div
          variants={logoVariants}
          className="flex justify-center"
        >
          <Clock size={48} className="text-purple-500" />
        </motion.div>
        <motion.h2
          variants={textVariants}
          className="mt-6 text-center text-3xl font-extrabold text-white"
        >
          Sign in to your account
        </motion.h2>
        <motion.p
          variants={textVariants}
          className="mt-2 text-center text-sm text-gray-400"
        >
          Enter your credentials to access your dashboard
        </motion.p>
      </motion.div>

      <motion.div
        variants={pageVariants}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.5,
            delay: 2,
            ease: [0.6, 0.01, -0.05, 0.95]
          }}
          className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 1.5,
              delay: 2.5,
              ease: "easeOut"
            }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 3.2, duration: 1 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Enter your password"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 3.4, duration: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;