import { useState } from "react";

export default function EmailSignUpForm() {
    const [formData, setFormData ] = useState({
        name: "",
        email: "",
        password: "",
    })

    const handleChange = (e: { target: { name: any; value: any; }; }) => {  
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); 
        console.log(formData);

        const res = await fetch("/api/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            alert("Account created successfully");
        } else {
            alert("Error creating account");
        }
    };

    return (
        <main>
            <h1>Sign Up</h1>
            
        </main>
    )
}
