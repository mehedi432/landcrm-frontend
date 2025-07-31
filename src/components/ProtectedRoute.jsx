// // React এবং React Router থেকে প্রয়োজনীয় ফাংশন ইম্পোর্ট করা হচ্ছে
// import React, { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";

// // ProtectedRoute কম্পোনেন্ট: শুধুমাত্র অথেন্টিকেটেড ইউজারদের জন্য রুট প্রটেক্ট করে
// const ProtectedRoute = ({ children }) => {
//   // authenticated স্টেট: null মানে লোডিং, true মানে অথেন্টিকেটেড, false মানে নয়
//   const [authenticated, setAuthenticated] = useState(null); // null = loading
//   const location = useLocation();

//   useEffect(() => {
//     // ইউজার অথেন্টিকেটেড কিনা চেক করার জন্য API কল
//     async function checkAuth() {
//       try {
//         // ব্যাকএন্ডে রিকোয়েস্ট পাঠানো হচ্ছে ইউজার চেক করার জন্য
//         const res = await fetch("http://127.0.0.1:8000/api/method/frappe.auth.get_logged_user");
//         const data = await res.json();
//         // যদি ইউজার "Guest" না হয়, তাহলে অথেন্টিকেটেড ধরে নেওয়া হচ্ছে
//         setAuthenticated(data.message !== "Guest");
//       } catch (err) {
//         // কোনো এরর হলে অথেন্টিকেটেড false সেট করা হচ্ছে
//         setAuthenticated(false);
//       }
//     }
//     checkAuth();
//   }, []);

//   if (authenticated === null) {
//     // ডাটা লোডিং হচ্ছে, চাইলে এখানে স্পিনার দেখানো যেতে পারে
//     return <div>Loading...</div>;
//   }

//   if (!authenticated) {
//     // ইউজার অথেন্টিকেটেড না হলে লগইন পেজে রিডাইরেক্ট করা হচ্ছে
//     return <Navigate to="/authentication/login/creative" replace />;
//   }

//   // যদি ইউজার লগইন পেজে অথেন্টিকেটেড অবস্থায় আসে, তাহলে landlist-এ পাঠানো হবে
//   if (location.pathname === "/authentication/login/creative") {
//     return <Navigate to="/properties/landlist" replace />;
//   }

//   // অথেন্টিকেটেড হলে চাইল্ড কম্পোনেন্ট (প্রটেক্টেড কনটেন্ট) রেন্ডার করা হচ্ছে
//   return children;
// };

// export default ProtectedRoute;


import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/method/frappe.auth.get_logged_user", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        setAuthenticated(data.message !== "Guest");
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null; // or a full-screen spinner

  const isAuthPage = location.pathname.startsWith("/authentication");

  // If not logged in & not on auth page → redirect to login
  if (!authenticated && !isAuthPage) {
    return <Navigate to="/authentication/login/creative" replace />;
  }

  // If logged in & tries to access an auth page → redirect to dashboard
  if (authenticated && isAuthPage) {
    return <Navigate to="/properties/landlist" replace />;
  }

  return children;
};

export default ProtectedRoute;


