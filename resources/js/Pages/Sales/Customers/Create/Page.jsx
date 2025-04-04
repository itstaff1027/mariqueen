import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const CreatedCustomers = () => {
  const { data, setData, post, errors } = useForm({
    first_name: '',
    last_name: '',
    receiver_name: '',
    email: '',
    phone: '',
    address: '',
    social_media_account: '',
    gender: '', 
    birthday: '', 
    age: '', 
    region: '', 
    province: '', 
    city: '', 
    brgy: '', 
    street: '', 
    zip_code: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
    post('/customers');
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-2xl font-bold text-gray-800">Create Customers</h2>
      }
    >
      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                      Personal Information
                    </h3>
                    <div className="mb-4">
                      <InputLabel htmlFor="first_name" value="First Name" />
                      <TextInput
                        id="first_name"
                        name="first_name"
                        value={data.first_name}
                        onChange={(e) =>
                          setData('first_name', e.target.value)
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.first_name} />
                    </div>
                    <div className="mb-4">
                      <InputLabel htmlFor="last_name" value="Last Name" />
                      <TextInput
                        id="last_name"
                        name="last_name"
                        value={data.last_name}
                        onChange={(e) =>
                          setData('last_name', e.target.value)
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.last_name} />
                    </div>
                    <div className="mb-4">
                      <InputLabel htmlFor="birthday" value="Birthday" />
                      <TextInput
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={data.birthday}
                        onChange={(e) =>
                          setData('birthday', e.target.value)
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.birthday} />
                    </div>
                    <div className="mb-4">
                      <InputLabel htmlFor="gender" value="Gender" />
                      <TextInput
                        id="gender"
                        name="gender"
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.gender} />
                    </div>
                    <div className="mb-4">
                      <InputLabel htmlFor="age" value="Age" />
                      <TextInput
                        id="age"
                        name="age"
                        type="number"
                        value={data.age}
                        onChange={(e) => setData('age', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.age} />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                      Contact Information
                    </h3>
                    <div className="mb-4">
                      <InputLabel htmlFor="email" value="Email" />
                      <TextInput
                        id="email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.email} />
                    </div>
                    <div className="mb-4">
                      <InputLabel htmlFor="phone" value="Phone" />
                      <TextInput
                        id="phone"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.phone} />
                    </div>
                    <div className="mb-4">
                      <InputLabel
                        htmlFor="social_media_account"
                        value="Social Media Account"
                      />
                      <TextInput
                        id="social_media_account"
                        name="social_media_account"
                        value={data.social_media_account}
                        onChange={(e) =>
                          setData('social_media_account', e.target.value)
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.social_media_account} />
                    </div>
                    <div className="mb-4">
                      <InputLabel
                        htmlFor="receiver_name"
                        value="Receiver name"
                      />
                      <TextInput
                        id="receiver_name"
                        name="receiver_name"
                        value={data.receiver_name}
                        onChange={(e) =>
                          setData('receiver_name', e.target.value)
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.receiver_name} />
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Address Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4 md:col-span-2">
                      <InputLabel htmlFor="address" value="Full Address" />
                      <TextInput
                        id="address"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.address} />
                    </div>
                    <div className="mb-4">
                      <InputLabel htmlFor="region" value="Region" />
                      <TextInput
                        id="region"
                        name="region"
                        value={data.region}
                        onChange={(e) => setData('region', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.region} />
                    </div>
                    <div className="mb-4">
                      <InputLabel htmlFor="province" value="Province" />
                      <TextInput
                        id="province"
                        name="province"
                        value={data.province}
                        onChange={(e) => setData('province', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.province} />
                    </div>
                    <div className="mb-4">
                      <InputLabel htmlFor="city" value="City" />
                      <TextInput
                        id="city"
                        name="city"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.city} />
                    </div>
                    <div className="mb-4">
                      <InputLabel htmlFor="brgy" value="Barangay" />
                      <TextInput
                        id="brgy"
                        name="brgy"
                        value={data.brgy}
                        onChange={(e) => setData('brgy', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.brgy} />
                    </div>
                    <div className="mb-4">
                      <InputLabel htmlFor="street" value="Street" />
                      <TextInput
                        id="street"
                        name="street"
                        value={data.street}
                        onChange={(e) => setData('street', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.street} />
                    </div>
                    <div className="mb-4">
                      <InputLabel htmlFor="zip_code" value="Zip Code" />
                      <TextInput
                        id="zip_code"
                        name="zip_code"
                        value={data.zip_code}
                        onChange={(e) => setData('zip_code', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                      <InputError message={errors.zip_code} />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 text-center">
                  <button
                    type="submit"
                    className="inline-block bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded"
                  >
                    Create Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default CreatedCustomers;
