// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/auth.css";

// function Register() {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [role, setRole] = useState("user");
//     const [storeName, setStoreName] = useState("");
//     const [storeAddress, setStoreAddress] = useState("");
//     const navigate = useNavigate();

//     const handleRegister = async () => {
//         try {
//             const data = { name, email, password, role };

//             // If user is a store owner, add store details
//             if (role === "store_owner") {
//                 data.storeName = storeName;
//                 data.storeAddress = storeAddress;
//             }

//             await axios.post("http://localhost:5000/api/auth/register", data);
//             alert("Registration successful! Please login.");
//             navigate("/");
//         } catch (err) {
//             alert("Error registering");
//         }
//     };

//     return (
//         <div className="auth-container">
//             <h2>📝 Register</h2>
//             <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} required />
//             <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} required />
//             <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />

//             <select value={role} onChange={(e) => setRole(e.target.value)}>
//                 <option value="user">Normal User</option>
//                 <option value="store_owner">Store Owner</option>
//             </select>

//             {role === "store_owner" && (
//                 <>
//                     <input type="text" placeholder="Store Name" onChange={(e) => setStoreName(e.target.value)} required />
//                     <input type="text" placeholder="Store Address" onChange={(e) => setStoreAddress(e.target.value)} required />
//                 </>
//             )}

//             <button onClick={handleRegister}>Register</button>
//             <p className="register-text">have an account? <a href="/">Login Here</a></p>
//         </div>
//     );
// }

// export default Register;


import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [storeName, setStoreName] = useState("");
    const [storeAddress, setStoreAddress] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        // Basic validation
        if (!name || !email || !password || !role) {
            alert("Please fill all required fields.");
            return;
        }

        if (role === "store_owner" && (!storeName || !storeAddress)) {
            alert("Please enter store name and address.");
            return;
        }

        try {
            const data = {
                name,
                email,
                password,
                role,
                ...(role === "store_owner" && { storeName, storeAddress })
            };

            const response = await axios.post("http://localhost:5000/api/auth/register", data);
            alert(response.data.message || "Registration successful! Please login.");
            navigate("/");
        } catch (err) {
            console.error("Registration Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Error registering user.");
        }
    };

    return (
        <div className="auth-container">
            <h2>📝 Register</h2>
            <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">Normal User</option>
                <option value="store_owner">Store Owner</option>
            </select>

            {role === "store_owner" && (
                <>
                    <input
                        type="text"
                        placeholder="Store Name"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Store Address"
                        value={storeAddress}
                        onChange={(e) => setStoreAddress(e.target.value)}
                        required
                    />
                </>
            )}

            <button onClick={handleRegister}>Register</button>
            <p className="register-text">
                Have an account? <a href="/">Login Here</a>
            </p>
        </div>
    );
}

export default Register;
