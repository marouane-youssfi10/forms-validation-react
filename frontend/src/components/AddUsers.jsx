import api from "../api/useAxios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usersSchema } from "../validations/UsersShema";

import { FETCH_USERS_FAILURE } from "../store/actions";
import { useState } from "react";
import { useDispatch } from "react-redux";

const AddUsers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        trigger,
        getFieldState,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        resolver: zodResolver(usersSchema),
    });
    const [emailAvailabilityStatus, setEmailAvailabilityStatus] =
        useState("idle");
    const [enterdEmail, setEnterdEmail] = useState(null);

    const submitForm = async (data) => {
        const formData = new FormData();

        formData.append("first_name", data.firstName);
        formData.append("last_name", data.lastName);
        formData.append("email", data.email);
        formData.append("image", data.image[0]);

        try {
            await api.post("/api/users/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/");
        } catch (err) {
            console.log("err.response", err.response);
            if (err.response) {
                dispatch({
                    type: FETCH_USERS_FAILURE,
                    payload: err.response.data,
                });
            } else if (err.request) {
                dispatch({
                    type: FETCH_USERS_FAILURE,
                    payload: "No response from server",
                });
            } else {
                console.log("else");
                dispatch({
                    type: FETCH_USERS_FAILURE,
                    payload: err.message,
                });
            }
        }
    };

    const { onBlur, ...emailRegister } = register("email");

    const checkEmailAvailability = async (email) => {
        setEnterdEmail(email);
        setEmailAvailabilityStatus("checking");
        try {
            const res = await api.get(`/api/check-email/?email=${email}`);
            if (res.data.available) {
                setEmailAvailabilityStatus("available");
            } else {
                setEmailAvailabilityStatus("notAvailable");
            }
        } catch (err) {
            console.log("err =", err);
            setEmailAvailabilityStatus("failed");
        }
    };

    const resetCheckEmailAvailability = () => {
        setEmailAvailabilityStatus("idle");
        setEnterdEmail(null);
    };

    const emailOnBlurHandler = async (e) => {
        await trigger("email");
        const { isDirty, invalid } = getFieldState("email");
        const email = e.target.value;
        console.log("errors", errors);
        // isDirty: if the user change the original value
        // invalid: if the field has an error

        if (isDirty && !invalid && enterdEmail !== email) {
            checkEmailAvailability(email);
        }

        if (isDirty && invalid && enterdEmail) {
            resetCheckEmailAvailability();
        }
    };

    return (
        <div className="form-container">
            <h2>Add New User</h2>

            <form
                action="#"
                method="POST"
                className="user-form"
                onSubmit={handleSubmit(submitForm)}
            >
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        {...register("firstName")}
                    />
                    <small className="message error">
                        {errors.firstName?.message}
                    </small>
                </div>

                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        {...register("lastName")}
                    />
                    <small className="message error">
                        {errors.lastName?.message}
                    </small>
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        {...emailRegister}
                        onBlur={(e) => {
                            onBlur(e);
                            emailOnBlurHandler(e);
                        }}
                    />
                    <small className="message error">
                        {errors.email?.message
                            ? errors.email?.message
                            : emailAvailabilityStatus === "notAvailable"
                              ? "This email is already in use."
                              : emailAvailabilityStatus === "failed"
                                ? "Error from the server."
                                : ""}
                    </small>
                    <small className="message">
                        {emailAvailabilityStatus === "checking"
                            ? "We're currently checking the availability of this email address. Please wait a moment."
                            : ""}
                    </small>
                    <small className="message success">
                        {emailAvailabilityStatus === "available"
                            ? "This email is available for use."
                            : ""}
                    </small>
                </div>

                <div className="form-group">
                    <label>Upload Image</label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        {...register("image")}
                    />
                    <small className="message error">
                        {errors.image?.message}
                    </small>
                </div>

                <button type="submit" className="btn-submit">
                    Add User
                </button>
            </form>
        </div>
    );
};

export default AddUsers;
