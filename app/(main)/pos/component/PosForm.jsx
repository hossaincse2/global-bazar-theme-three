'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Zod schema validation
const UserFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Username must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters.' }),
});

export function PosForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(UserFormSchema),
    });

    const onSubmit = (data) => {
        console.log('Form Submitted:', data);
        alert(`Form Submitted: ${JSON.stringify(data, null, 2)}`);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md p-4 mx-auto space-y-4 border border-gray-300 rounded-lg"
        >
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Username
                </label>
                <input
                    type="text"
                    {...register('username')}
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
                {errors.username && (
                    <span className="text-sm text-red-600">
                        {errors.username.message}
                    </span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    {...register('email')}
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
                {errors.email && (
                    <span className="text-sm text-red-600">
                        {errors.email.message}
                    </span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    type="password"
                    {...register('password')}
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
                {errors.password && (
                    <span className="text-sm text-red-600">
                        {errors.password.message}
                    </span>
                )}
            </div>

            <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Submit
            </button>
        </form>
    );
}
