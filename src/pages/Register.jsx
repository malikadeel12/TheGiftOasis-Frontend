import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
      repeatPassword: e.target.repeatPassword.value,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      address: e.target.address.value,
      country: e.target.country.value,
      state: e.target.state.value,
      city: e.target.city.value,
      prefix: "+92",
      phone: phone,
      zip: e.target.zip.value,
    };

    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const { data } = await registerUser(formData);
      alert(data.message || "Registration complete!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-12 border border-pink-100">

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-pink-500 mb-2">
          New Customer
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Already Registered?{" "}
          <a href="#" className="text-pink-500 hover:underline">Log in</a>
        </p>

        {/* Login with Gmail */}
        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 mb-8 shadow-md">
          <span className="bg-white text-red-500 rounded-full w-7 h-7 flex items-center justify-center font-bold">g</span>
          Login with Gmail
        </button>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* User Account */}
          <div>
            <h3 className="text-lg font-semibold text-pink-500 mb-2">User Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="email" type="email" placeholder="Email *" className="input" required />
              <input name="password" type="password" placeholder="Password *" className="input" required />
              <input name="repeatPassword" type="password" placeholder="Repeat Password *" className="input md:col-span-2" required />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-pink-500 mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="firstName" type="text" placeholder="First Name *" className="input" required />
              <input name="lastName" type="text" placeholder="Last Name *" className="input" required />
              <input name="address" type="text" placeholder="Address *" className="input md:col-span-2" required />
              <input name="country" type="text" placeholder="Country *" className="input" required />
              <input name="state" type="text" placeholder="State / Province *" className="input" required />
              <input name="city" type="text" placeholder="City *" className="input" required />

              {/* Prefix + Phone */}
              <div className="flex flex-col md:flex-row">
                <input
                  type="text"
                  value="+92"
                  readOnly
                  className="md:w-16 w-full md:rounded-l-lg md:rounded-r-none rounded-t-lg md:rounded-t-none border border-pink-200 bg-gray-100 text-gray-800 px-3 py-3"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="3001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 px-4 py-3 border border-pink-200 bg-pink-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 md:rounded-r-lg md:rounded-l-none rounded-b-lg md:rounded-b-none"
                  required
                />
              </div>

              <input name="zip" type="text" placeholder="Post/Zip Code *" className="input" required />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-pink-500" required />
              I agree with the terms and conditions.
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-pink-500" />
              I wish to receive emails about new promotions/deals/products.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
          >
            Create Account
          </button>
        </form>
      </div>

      {/* Tailwind custom style */}
      <style>{`
        .input {
          @apply w-full px-4 py-3 rounded-lg border border-pink-200 bg-pink-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300;
        }
      `}</style>
    </section>
  );
}
