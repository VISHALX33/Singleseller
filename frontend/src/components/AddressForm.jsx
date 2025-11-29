import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function AddressForm({ onSubmit, initialData = null, isLoading = false }) {
  const [formData, setFormData] = useState(
    initialData || {
      fullName: '',
      phone: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      isDefault: false,
    }
  );

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!/^\d{6}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Postal code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.fullName}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="9876543210"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.phone}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.email}
            </p>
          )}
        </div>

        {/* Address Line 1 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="House No., Building Name"
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.addressLine1}
            </p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apt., Suite, etc. (Optional)
          </label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Apartment, suite, etc."
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City/District *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Mumbai"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.city}
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Maharashtra"
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.state}
            </p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code *
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="400001"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.postalCode}
            </p>
          )}
        </div>
      </div>

      {/* Default Address Checkbox */}
      <div className="flex items-center gap-2 py-2">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="w-4 h-4 rounded border-gray-300 text-blue-600"
        />
        <label htmlFor="isDefault" className="text-sm text-gray-700">
          Set as default address
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {isLoading ? 'Saving...' : 'Continue'}
      </button>
    </form>
  );
}
