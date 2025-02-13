import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const UserForm = ({ method, initialData, onSubmit, managers }) => {
    const [formData, setFormData] = useState({
        email: "",
        id: "",
        manager: "",
        name: "",
        password: "",
        confirmPassword: "",
        role: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                email: initialData.email || "",
                id: initialData.id || "",
                manager: initialData.manager || "",
                name: initialData.name || "",
                password: "",
                confirmPassword: "",
                role: initialData.role || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let validationErrors = {};

        if (!formData.email) {
            validationErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            validationErrors.email = "Email is not valid";
        }
        if (!formData.name) validationErrors.name = "Name is required";
        if (!formData.role) validationErrors.role = "Role is required";
        if (!formData.manager) validationErrors.manager = "Manager is required";
        if (method === "POST") {
            if (!formData.password) validationErrors.password = "Password is required";
            if (formData.password !== formData.confirmPassword) {
                validationErrors.confirmPassword = "Passwords do not match";
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        const data = {
            name: formData.name,
            email: formData.email,
            managerId: parseInt(formData.manager, 10),
            role: parseInt(formData.role, 10),
            password: method === 'POST' ? formData.password : "NoPassword",
        };

        onSubmit(data);
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.role ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select a role</option>
                        <option value="3">Admin</option>
                        <option value="1">Employee</option>
                        <option value="2">Manager</option>
                    </select>
                    {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                </div>

                <div>
                    <label htmlFor="manager" className="block text-sm font-medium text-gray-700">Manager</label>
                    <select
                        id="manager"
                        name="manager"
                        value={formData.manager}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.manager ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select a manager</option>
                        <option value="1">Admin</option>
                        {managers.map((manager) => (
                            <option key={manager.id} value={manager.id}>
                                {manager.name}
                            </option>
                        ))}
                    </select>
                    {errors.manager && <p className="mt-1 text-sm text-red-500">{errors.manager}</p>}
                </div>

                {method === "POST" && (
                    <>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {method === "POST" ? "Create User" : "Update User"}
                </button>
            </form>
        </div>
    );
};

UserForm.propTypes = {
    method: PropTypes.oneOf(["POST", "PUT"]).isRequired,
    initialData: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.number,
        manager: PropTypes.string,
        name: PropTypes.string,
        password: PropTypes.string,
        role: PropTypes.string,
    }),
    onSubmit: PropTypes.func.isRequired,
    managers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default UserForm;
